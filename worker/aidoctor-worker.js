/**
 * AI Doctor — Cloudflare Worker (updated)
 * ---------------------------------------------------------------------------
 * Routes (exactly what the frontend expects):
 *   POST /            -> Claude chat. Body: { system, messages, max_tokens, pro }
 *                        Returns: { reply } | { error: { message, code } }
 *   POST /transcribe  -> Groq Whisper. multipart/form-data: audio (+ optional language)
 *                        Returns: { transcript } | { error }
 *   POST /checkpro    -> Gumroad. Body: { email }  ->  { is_pro: boolean }
 *   GET  /            -> health check
 *
 * Required secrets (Cloudflare dashboard -> Worker -> Settings -> Variables, or `wrangler secret put`):
 *   ANTHROPIC_KEY            Anthropic API key (sk-ant-...)
 *   GROQ_KEY                 Groq API key (gsk_...)               [for /transcribe]
 *   GUMROAD_ACCESS_TOKEN     Gumroad seller access token          [for /checkpro]
 *   GUMROAD_PRODUCT_ID       Gumroad product id (optional filter)  [for /checkpro]
 *
 * Optional plain vars:
 *   MODEL                    Claude model id (default: claude-3-5-sonnet-latest)
 *   ALLOWED_ORIGIN           e.g. https://aidoctor.study (default: *)
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // Preflight
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { "Content-Type": "application/json", ...cors },
      });

    try {
      if (request.method === "GET" && path === "/") {
        return json({ ok: true, service: "aidoctor-worker" });
      }
      if (path === "/transcribe" && request.method === "POST") {
        return await handleTranscribe(request, env, json);
      }
      if (path === "/checkpro" && request.method === "POST") {
        return await handleCheckPro(request, env, json);
      }
      if (path === "/" && request.method === "POST") {
        return await handleChat(request, env, json);
      }
      return json({ error: { message: "Not found", code: 404 } }, 404);
    } catch (err) {
      return json({ error: { message: err.message || "Worker error", code: 500 } }, 500);
    }
  },
};

/* ------------------------- POST /  (Claude chat) ------------------------- */
async function handleChat(request, env, json) {
  if (!env.ANTHROPIC_KEY) return json({ error: { message: "ANTHROPIC_KEY not set", code: 500 } }, 500);

  const body = await request.json();
  const system = body.system || "";
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const maxTokens = Math.min(Math.max(parseInt(body.max_tokens, 10) || 2000, 256), 4096);
  const model = env.MODEL || "claude-3-5-sonnet-latest";

  const resp = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
  });

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    const message =
      (data && data.error && data.error.message) ||
      (resp.status === 429 ? "AI busy — wait 20 seconds and retry" : "AI request failed");
    return json({ error: { message, code: resp.status } }, 200);
  }

  const reply = Array.isArray(data.content)
    ? data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim()
    : "";

  if (!reply) return json({ error: { message: "Empty response — please try again", code: 502 } }, 200);
  return json({ reply });
}

/* --------------------- POST /transcribe (Groq Whisper) ------------------- */
async function handleTranscribe(request, env, json) {
  if (!env.GROQ_KEY) return json({ error: "GROQ_KEY not set in Worker" }, 200);

  const form = await request.formData();
  const audio = form.get("audio");
  if (!audio) return json({ error: "No audio file provided" }, 200);

  const language = form.get("language");
  const groqForm = new FormData();
  groqForm.append("file", audio, (audio && audio.name) || "audio.mp3");
  groqForm.append("model", "whisper-large-v3");
  groqForm.append("response_format", "json");
  if (language && language !== "auto") {
    // Groq wants ISO-639-1 (e.g. "en"); strip region like "en-US"
    groqForm.append("language", String(language).split("-")[0]);
  }

  const resp = await fetch(GROQ_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.GROQ_KEY}` },
    body: groqForm,
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    return json({ error: (data && data.error && data.error.message) || "Transcription failed" }, 200);
  }
  return json({ transcript: data.text || "" });
}

/* --------------------- POST /checkpro (Gumroad) -------------------------- */
async function handleCheckPro(request, env, json) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").trim().toLowerCase();
  if (!email) return json({ is_pro: false });
  if (!env.GUMROAD_ACCESS_TOKEN) return json({ is_pro: false });

  // Query the seller's sales filtered by buyer email.
  const params = new URLSearchParams({ access_token: env.GUMROAD_ACCESS_TOKEN, email });
  if (env.GUMROAD_PRODUCT_ID) params.set("product_id", env.GUMROAD_PRODUCT_ID);

  const resp = await fetch(`https://api.gumroad.com/v2/sales?${params.toString()}`, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await resp.json().catch(() => ({}));

  const sales = Array.isArray(data.sales) ? data.sales : [];
  const active = sales.some(
    (s) => !s.refunded && !s.chargebacked && s.subscription_cancelled_at == null && s.subscription_ended_at == null
  );
  return json({ is_pro: active });
}
