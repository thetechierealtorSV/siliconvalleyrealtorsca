import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";
const OWNER_PHONE = "+16506409777";

function truncate(s: string, n: number): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "\u2026" : s;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const feedback_id = typeof body?.feedback_id === "string" ? body.feedback_id : "";

    if (!UUID_RE.test(feedback_id)) {
      return new Response(JSON.stringify({ ok: false, error: "invalid feedback_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");
    if (!SUPABASE_URL || !SERVICE_ROLE || !LOVABLE_API_KEY || !TWILIO_API_KEY || !TWILIO_FROM_NUMBER) {
      console.error("notify-feedback misconfigured: missing required secret");
      return new Response(JSON.stringify({ ok: false, error: "misconfigured" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up the actual feedback row server-side — never trust client-supplied text.
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: row, error } = await supabase
      .from("site_feedback")
      .select("id, rating, liked, liked_notes, improve_notes, contact_opt_in, name, email, created_at")
      .eq("id", feedback_id)
      .maybeSingle();

    if (error || !row) {
      return new Response(JSON.stringify({ ok: false, error: "not_found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only notify when the visitor actually asked for follow-up.
    if (!row.contact_opt_in) {
      return new Response(JSON.stringify({ ok: true, skipped: "no_optin" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Avoid double-sending for the same feedback row.
    const { data: prior } = await supabase
      .from("lead_notifications")
      .select("id")
      .eq("channel", "sms_feedback")
      .eq("status", "sent")
      .ilike("detail", `%fbid:${row.id}%`)
      .limit(1);
    if (prior && prior.length > 0) {
      return new Response(JSON.stringify({ ok: true, skipped: "already_sent" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const likedStr = Array.isArray(row.liked) && row.liked.length ? row.liked.join(", ") : "none";
    const snippet = truncate(
      [row.liked_notes, row.improve_notes].filter(Boolean).join(" | "),
      280,
    ) || "(no comments)";
    const ratingStr = row.rating ? `${row.rating}/5` : "n/a";
    const who = [row.name, row.email].filter(Boolean).join(" · ") || "(no contact info)";

    const msg =
`NKPG site feedback
Rating: ${ratingStr}
Liked: ${likedStr}
Notes: ${snippet}
From: ${who}`;

    let ok = false;
    let detail = `fbid:${row.id}`;
    try {
      const resp = await fetch(`${GATEWAY_URL}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TWILIO_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: OWNER_PHONE,
          From: TWILIO_FROM_NUMBER,
          Body: msg,
        }),
      });
      ok = resp.ok;
      if (!resp.ok) {
        const t = await resp.text();
        console.error(`notify-feedback Twilio ${resp.status}`);
        detail += ` status:${resp.status}`;
        void t;
      }
    } catch (e) {
      console.error("notify-feedback Twilio threw");
      void e;
    }

    await supabase.from("lead_notifications").insert({
      lead_id: null,
      channel: "sms_feedback",
      status: ok ? "sent" : "failed",
      detail: detail.slice(0, 400),
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-feedback error");
    void e;
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
