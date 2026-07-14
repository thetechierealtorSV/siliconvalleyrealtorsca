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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_LIKED = new Set(["design", "ease", "sunpath", "fengshui", "listings", "speed"]);

function clampStr(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t) return null;
  return t.slice(0, max);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));

    // Validate all inputs server-side against the same rules as the site_feedback
    // check constraints. Never trust raw client text for the SMS body — always
    // re-read the inserted row.
    const rawRating = body?.rating;
    const rating = (typeof rawRating === "number" && rawRating >= 1 && rawRating <= 5)
      ? Math.round(rawRating) : null;

    const liked = Array.isArray(body?.liked)
      ? body.liked.filter((v: unknown) => typeof v === "string" && ALLOWED_LIKED.has(v)).slice(0, 10)
      : null;

    const liked_notes = clampStr(body?.liked_notes, 1000);
    const improve_notes = clampStr(body?.improve_notes, 2000);
    const page_url = clampStr(body?.page_url, 500);
    const user_agent = clampStr(body?.user_agent, 500);
    const attachment_url = clampStr(body?.attachment_url, 500);

    const contact_opt_in = !!body?.contact_opt_in;
    let name: string | null = null;
    let email: string | null = null;
    if (contact_opt_in) {
      name = clampStr(body?.name, 120);
      email = clampStr(body?.email, 255);
      if (!name || !email || !EMAIL_RE.test(email)) {
        return new Response(JSON.stringify({ ok: false, error: "invalid_contact" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Require at least some content — matches the client-side validation.
    if (!rating && (!liked || liked.length === 0) && !liked_notes && !improve_notes) {
      return new Response(JSON.stringify({ ok: false, error: "empty" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      console.error("notify-feedback misconfigured: missing supabase secret");
      return new Response(JSON.stringify({ ok: false, error: "misconfigured" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: inserted, error: insertErr } = await supabase
      .from("site_feedback")
      .insert({
        rating, liked, liked_notes, improve_notes,
        contact_opt_in, name, email,
        attachment_url, page_url, user_agent,
      })
      .select("id, rating, liked, liked_notes, improve_notes, contact_opt_in, name, email")
      .single();

    if (insertErr || !inserted) {
      console.error("notify-feedback insert failed");
      return new Response(JSON.stringify({ ok: false, error: "insert_failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only notify when the visitor asked for follow-up.
    if (!inserted.contact_opt_in) {
      return new Response(JSON.stringify({ ok: true, id: inserted.id, skipped: "no_optin" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER");
    if (!LOVABLE_API_KEY || !TWILIO_API_KEY || !TWILIO_FROM_NUMBER) {
      console.error("notify-feedback misconfigured: missing twilio secret");
      // Feedback was still saved — never fail the user on SMS.
      return new Response(JSON.stringify({ ok: true, id: inserted.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const likedStr = Array.isArray(inserted.liked) && inserted.liked.length
      ? inserted.liked.join(", ") : "none";
    const snippet = truncate(
      [inserted.liked_notes, inserted.improve_notes].filter(Boolean).join(" | "),
      280,
    ) || "(no comments)";
    const ratingStr = inserted.rating ? `${inserted.rating}/5` : "n/a";
    const who = [inserted.name, inserted.email].filter(Boolean).join(" \u00b7 ") || "(no contact info)";

    const msg =
`NKPG site feedback
Rating: ${ratingStr}
Liked: ${likedStr}
Notes: ${snippet}
From: ${who}`;

    let ok = false;
    let detail = `fbid:${inserted.id}`;
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
        detail += ` status:${resp.status}`;
        console.error(`notify-feedback Twilio ${resp.status}`);
        try { await resp.text(); } catch (_) { /* ignore */ }
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

    return new Response(JSON.stringify({ ok: true, id: inserted.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-feedback error");
    void e;
    return new Response(JSON.stringify({ ok: false, error: "internal" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
