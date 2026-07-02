import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

function toE164(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits.length >= 8 ? digits : null;
  // assume US if 10 digits
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Internal-only endpoint: require service-role JWT (the chat function passes it).
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const auth = req.headers.get("Authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!SERVICE_ROLE || token !== SERVICE_ROLE) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { lead_id, phone, name } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");
    if (!LOVABLE_API_KEY || !TWILIO_API_KEY || !TWILIO_FROM_NUMBER) {
      console.error("send-welcome-sms misconfigured: missing required secret");
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const to = toE164(String(phone || ""));
    if (!to) return new Response(JSON.stringify({ ok: false, error: "invalid phone" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, SERVICE_ROLE);

    // Validate lead_id references a real lead (prevents arbitrary number sends)
    if (!lead_id) {
      return new Response(JSON.stringify({ error: "lead_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: leadRow } = await supabase.from("leads").select("id").eq("id", lead_id).maybeSingle();
    if (!leadRow) {
      return new Response(JSON.stringify({ error: "unknown lead" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Avoid double-sending: check lead_notifications for prior welcome SMS
    if (lead_id) {
      const { data: prior } = await supabase
        .from("lead_notifications")
        .select("id")
        .eq("lead_id", lead_id)
        .eq("channel", "sms_welcome")
        .eq("status", "sent")
        .limit(1);
      if (prior && prior.length > 0) {
        return new Response(JSON.stringify({ ok: true, skipped: "already_sent" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const firstName = String(name || "").trim().split(/\s+/)[0] || "there";
    const body =
`Hi ${firstName}, this is Nikolaenko Estates. Thanks for reaching out — a senior agent will follow up shortly to help with your Bay Area search or valuation.

Questions in the meantime? Just reply to this text.

Reply STOP to opt out, HELP for help. Msg & data rates may apply.`;

    const resp = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: to, From: TWILIO_FROM_NUMBER, Body: body }),
    });

    const data = await resp.json();
    const ok = resp.ok;

    await supabase.from("lead_notifications").insert({
      lead_id: lead_id ?? null,
      channel: "sms_welcome",
      status: ok ? "sent" : "failed",
      detail: ok ? `sid:${data.sid ?? ""} to:${to}` : `error:${JSON.stringify(data).slice(0, 400)}`,
    });

    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-welcome-sms error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
