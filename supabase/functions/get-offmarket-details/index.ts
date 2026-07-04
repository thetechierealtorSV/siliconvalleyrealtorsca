import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  listing_id: z.string().uuid(),
  email: z.string().trim().email().max(200),
});

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { listing_id, email } = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify that an unlock row exists for this listing + email
    const { data: unlock, error: uErr } = await supabase
      .from("offmarket_unlocks")
      .select("id")
      .eq("listing_id", listing_id)
      .ilike("email", email.trim())
      .limit(1)
      .maybeSingle();
    if (uErr) throw uErr;
    if (!unlock) {
      return new Response(JSON.stringify({ error: "Not unlocked" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: listing, error: lErr } = await supabase
      .from("offmarket_listings")
      .select("hidden_details, status")
      .eq("id", listing_id)
      .maybeSingle();
    if (lErr) throw lErr;
    if (!listing || listing.status !== "active") {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ hidden_details: listing.hidden_details ?? null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("get-offmarket-details error:", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
