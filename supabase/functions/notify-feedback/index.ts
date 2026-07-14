import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      rating,
      liked,
      liked_notes,
      improve_notes,
      contact_opt_in,
      name,
      email,
    } = body ?? {};

    // Only send when the visitor actually asked for follow-up.
    if (!contact_opt_in) {
      return new Response(JSON.stringify({ ok: true, skipped: "no_optin" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");
    if (!LOVABLE_API_KEY || !TWILIO_API_KEY || !TWILIO_FROM_NUMBER) {
      console.error("notify-feedback misconfigured: missing required secret");
      return new Response(JSON.stringify({ ok: false, error: "misconfigured" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const likedStr = Array.isArray(liked) && liked.length ? liked.join(", ") : "none";
    const snippet = truncate(
      [liked_notes, improve_notes].filter(Boolean).join(" | "),
      280,
    ) || "(no comments)";
    const ratingStr = rating ? `${rating}/5` : "n/a";
    const who = [name, email].filter(Boolean).join(" · ") || "(no contact info)";

    const msg =
`NKPG site feedback
Rating: ${ratingStr}
Liked: ${likedStr}
Notes: ${snippet}
From: ${who}`;

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
      if (!resp.ok) {
        const t = await resp.text();
        console.error(`notify-feedback Twilio ${resp.status}: ${t}`);
      }
    } catch (e) {
      console.error("notify-feedback Twilio threw:", e);
    }

    // Always return success — feedback UX must not depend on SMS.
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-feedback error:", e);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
