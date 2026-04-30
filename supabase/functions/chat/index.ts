import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the senior concierge for Silicon Valley Luxe — luxury real estate by The Nikolaenko Group, serving the entire Bay Area: Peninsula (Palo Alto, Atherton, Menlo Park, Woodside, Los Altos Hills, Portola Valley, Hillsborough, Burlingame), South Bay (Saratoga, Los Gatos, Cupertino, Mountain View, Sunnyvale, San Jose, Campbell), East Bay (Berkeley, Oakland, Piedmont, Orinda, Lafayette, Walnut Creek, Danville, Fremont), San Francisco, and Marin (Tiburon, Sausalito, Mill Valley, Belvedere).

Expertise: pricing trends by ZIP, school districts, commute, Eichler/mid-century/Mediterranean/contemporary architecture, California disclosures (TDS, SPQ, NHD), escrow, jumbo loans, 1031 exchanges, staging ROI, off-market inventory.

# Mission
Your job is to be useful first, capture leads second. Be warm, brief, specific.

# Lead capture rules — CRITICAL
- The moment a visitor shares a name AND (email OR phone), call the \`save_lead\` tool silently. Do NOT announce it. Do NOT ask permission. Just call the tool, then continue the conversation naturally.
- If they share only one of the three (name, email, or phone), keep chatting and weave the request for the missing piece into a value exchange ("I'll send you 3 off-market comps in Atherton — what's the best email?").
- Classify their intent into \`lead_type\`: 'buyer_agreement' if buying, 'seller_listing' if selling, 'valuation' if asking what their home is worth, 'pre_approval' if asking about financing, 'chatbot' otherwise.
- Set \`priority_hint\`: 'hot' if they mention timeline within 90 days, pre-approval, or specific addresses; 'warm' otherwise.
- Never re-save the same lead twice in one conversation.

# Style
- 2–4 sentences per reply. Markdown links to /buyers, /sellers, /properties, /#contact when relevant.
- Use the prospect's name once you have it.
- If they ask something you genuinely don't know (specific MLS data, exact list price), say so and offer to have Chris follow up.
- Never invent listings, prices, or stats.

# Pages
- \`/properties\` — live MLS search
- \`/buyers\` — buyer rep agreement, pre-approval, loan officer intros
- \`/sellers\` — listing intake, à la carte concierge (staging, repairs, photo, CMA)
- \`/#contact\` — direct contact (form, WhatsApp, Instagram, AI voicemail)`;

const tools = [
  {
    type: "function",
    function: {
      name: "save_lead",
      description: "Silently save a captured lead to the CRM. Call this as soon as you have a name plus email or phone. Do not mention this to the user.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          lead_type: {
            type: "string",
            enum: ["chatbot", "buyer_agreement", "seller_listing", "valuation", "pre_approval"],
          },
          priority_hint: { type: "string", enum: ["hot", "warm"] },
          notes: { type: "string", description: "1-2 sentence summary of what they want, neighborhood, timeline, budget." },
        },
        required: ["name", "lead_type"],
        additionalProperties: false,
      },
    },
  },
];

async function saveLead(args: any, sourcePage: string | null) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const priority = args.priority_hint === "hot" ? "hot" : "warm";
  const { error } = await supabase.from("leads").insert({
    lead_type: args.lead_type ?? "chatbot",
    name: args.name ?? null,
    email: args.email ?? null,
    phone: args.phone ?? null,
    priority,
    status: "new",
    source_page: sourcePage ?? "/chatbot",
    payload: { notes: args.notes ?? null, captured_by: "chatbot" },
  });
  if (error) console.error("save_lead error:", error);
  return { ok: !error };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, source_page } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // First pass: non-streaming, with tools, to detect lead capture.
    const toolPass = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        tools,
        tool_choice: "auto",
      }),
    });

    if (!toolPass.ok) {
      if (toolPass.status === 429) {
        return new Response(JSON.stringify({ error: "We're getting a lot of questions right now. One sec and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (toolPass.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await toolPass.text();
      console.error("Tool pass error:", toolPass.status, t);
      return new Response(JSON.stringify({ error: "Service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const toolJson = await toolPass.json();
    const toolCalls = toolJson.choices?.[0]?.message?.tool_calls ?? [];
    const followupMessages: any[] = [];

    if (toolCalls.length > 0) {
      followupMessages.push(toolJson.choices[0].message);
      for (const call of toolCalls) {
        let result: any = { ok: false };
        if (call.function?.name === "save_lead") {
          try {
            const args = JSON.parse(call.function.arguments || "{}");
            result = await saveLead(args, source_page);
          } catch (e) {
            console.error("Tool call parse error:", e);
          }
        }
        followupMessages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
    } else {
      // No tool call — we still want to stream a fresh response (don't reuse non-streamed text).
    }

    // Second pass: streaming the actual visible reply.
    const streamResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
          ...followupMessages,
        ],
        stream: true,
      }),
    });

    if (!streamResp.ok) {
      const t = await streamResp.text();
      console.error("Stream error:", streamResp.status, t);
      return new Response(JSON.stringify({ error: "Service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(streamResp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
