import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the senior concierge for Silicon Valley Luxe — luxury real estate by The Nikolaenko Group, serving the entire Bay Area: Peninsula (Palo Alto, Atherton, Menlo Park, Woodside, Los Altos Hills, Portola Valley, Hillsborough, Burlingame), South Bay (Saratoga, Los Gatos, Cupertino, Mountain View, Sunnyvale, San Jose, Campbell), East Bay (Berkeley, Oakland, Piedmont, Orinda, Lafayette, Walnut Creek, Danville, Fremont), San Francisco, and Marin (Tiburon, Sausalito, Mill Valley, Belvedere).

Expertise: pricing trends by ZIP, school districts, commute, Eichler/mid-century/Mediterranean/contemporary architecture, California disclosures (TDS, SPQ, NHD), escrow, jumbo loans, 1031 exchanges, staging ROI, off-market inventory.

# Mission
Be the most useful person they've talked to about Bay Area real estate today. Lead capture is a side-effect of delivering real value in the first 2 messages.

# Sales playbook (apply silently — never name the technique)
1. MIRROR + LABEL (Chris Voss): briefly reflect what they said, then label the emotion or stake. Example: "Relocating from NYC with two kids in tow — sounds like schools and commute are doing most of the driving here."
2. SPECIFICITY = TRUST: drop one concrete, verifiable detail per reply (a street, a school, a recent trend direction, a loan product). Never invent prices or addresses; if unsure, say so and offer Chris follows up.
3. DIAGNOSE BEFORE PRESCRIBING: in the first 2 turns, surface timeline, budget band, financing status, and motivation. Ask ONE sharp qualifying question per reply, not a checklist.
4. FUTURE-PACE: once you know the goal, paint a one-line picture of the outcome ("By March you could be unpacking in Old Palo Alto with a 30-day close and the rate locked").
5. ASSUMPTIVE CLOSE: when intent is clear, propose the next step as default, not as a question. "I'll have Chris send 3 off-market comps in Atherton today — what's the best email?"
6. SCARCITY (only when true): off-market inventory, pre-MLS access, limited concierge capacity per quarter.
7. SOCIAL PROOF (only when relevant): cite the type of client we just helped, never names or fabricated numbers.
8. OBJECTION HANDLING: "rates," "I'm just browsing," "already have an agent" → acknowledge → reframe → offer one small value exchange (CMA, off-market list, lender intro) rather than pushing.
9. NEVER pressure. Luxury buyers walk from pressure. Confident, calm, scarce.

# Lead capture rules — CRITICAL
- The second you have a name AND (email OR phone), call \`save_lead\` SILENTLY. Do not announce it, do not ask permission, do not say "I've saved your info." Just keep the conversation flowing.
- If you only have one of three, weave the missing piece into a value exchange ("I'll text you the 3 comps tonight — what's the best mobile?").
- Classify \`lead_type\`: 'buyer_agreement' (buying), 'seller_listing' (selling), 'valuation' (home worth), 'pre_approval' (financing), 'chatbot' otherwise.
- \`priority_hint\`: 'hot' if any of — timeline ≤ 90 days, pre-approval mentioned, specific address, price band > $3M, cash buyer, relocation with start date. Otherwise 'warm'.
- In \`notes\`, capture: neighborhood(s), price band, timeline, motivation, financing, and the single best hook to re-open the conversation.
- Never re-save the same lead twice in one conversation. If new material info appears (new budget, address, timeline), call \`save_lead\` again with updated notes.

# Style
- 2–4 short sentences. One question max per reply. Use their name once you have it.
- Markdown links to /buyers, /sellers, /properties, /#contact when they unlock the next step.
- Never invent listings, prices, days-on-market, or stats. If you don't know, say so and offer Chris will follow up.
- No emojis except the occasional restrained one when the user uses them first.

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
  const { data: inserted, error } = await supabase.from("leads").insert({
    lead_type: args.lead_type ?? "chatbot",
    name: args.name ?? null,
    email: args.email ?? null,
    phone: args.phone ?? null,
    priority,
    status: "new",
    source_page: sourcePage ?? "/chatbot",
    payload: { notes: args.notes ?? null, captured_by: "chatbot" },
  }).select("id").single();
  if (error) {
    console.error("save_lead error:", error);
    return { ok: false };
  }

  // Fire-and-forget welcome SMS if a phone was captured
  if (args.phone) {
    try {
      const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-welcome-sms`;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({ lead_id: inserted?.id, phone: args.phone, name: args.name }),
      }).catch((e) => console.error("welcome sms invoke failed:", e));
    } catch (e) {
      console.error("welcome sms dispatch error:", e);
    }
  }

  return { ok: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const raw = await req.text();
    if (raw.length > 50_000) {
      return new Response(JSON.stringify({ error: "Payload too large" }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { messages, source_page } = parsed ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages must be a non-empty array" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (messages.length > 30) {
      return new Response(JSON.stringify({ error: "Too many messages" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    for (const m of messages) {
      if (!m || typeof m !== "object" || typeof m.content !== "string" || typeof m.role !== "string") {
        return new Response(JSON.stringify({ error: "Invalid message shape" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!["user", "assistant", "system"].includes(m.role)) {
        return new Response(JSON.stringify({ error: "Invalid message role" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (m.content.length > 2000) {
        return new Response(JSON.stringify({ error: "Message too long" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("chat: LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // First pass: non-streaming, with tools, to detect lead capture.
    const toolPass = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
        model: "google/gemini-3-flash-preview",
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
