/**
 * AI Doctor Study — Cloudflare Worker (matches production architecture)
 * ===========================================================================
 * Routing:
 *   GET  /            -> health check
 *   POST /            -> AI chat. Body: { system, messages, max_tokens, pro }
 *                        - text        -> Groq Llama 3.3 70B
 *                        - has image   -> Kimi (vision) via OpenRouter
 *                        Returns: { reply, provider } | { error:{message,code} }
 *   POST /transcribe  -> Groq Whisper Large V3. FormData: audio (+ optional language)
 *                        Returns: { transcript } | { error }
 *   POST /gumroad     -> Gumroad webhook (x-www-form-urlencoded). Writes Pro
 *                        status to Firestore `gumroad_users` (35-day expiry).
 *   POST /checkpro    -> Body: { email } -> { is_pro } (reads Firestore).
 *
 * Secrets (wrangler secret put / dashboard):
 *   GROQ_KEY               Groq API key            (chat text + transcribe)
 *   OPENROUTER_KEY         OpenRouter API key       (vision/image chat)
 *   FIREBASE_PROJECT_ID    e.g. ai-doctor-study
 *   FIREBASE_CLIENT_EMAIL  service-account email    (…@…iam.gserviceaccount.com)
 *   FIREBASE_PRIVATE_KEY   service-account private key (PEM; \n or real newlines)
 * Optional vars:
 *   GROQ_MODEL     default "llama-3.3-70b-versatile"
 *   VISION_MODEL   default "moonshotai/kimi-k2.6"
 *   ALLOWED_ORIGIN default "*"  (set to "https://aidoctor.study" to lock CORS)
 *   PRO_DAYS       default "35"
 */

const GROQ_CHAT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_TRANSCRIBE = "https://api.groq.com/openai/v1/audio/transcriptions";
const OPENROUTER_CHAT = "https://openrouter.ai/api/v1/chat/completions";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const path = new URL(request.url).pathname.replace(/\/+$/, "") || "/";
    const json = (o, s = 200) =>
      new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", ...cors } });

    try {
      if (request.method === "GET" && path === "/") return json({ ok: true, service: "aidoctor-worker" });
      if (request.method === "POST" && path === "/") return await handleChat(request, env, json);
      if (request.method === "POST" && path === "/transcribe") return await handleTranscribe(request, env, json);
      if (request.method === "POST" && path === "/gumroad") return await handleGumroad(request, env, json);
      if (request.method === "POST" && path === "/checkpro") return await handleCheckPro(request, env, json);
      return json({ error: { message: "Not found", code: 404 } }, 404);
    } catch (err) {
      return json({ error: { message: err.message || "Worker error", code: 500 } }, 500);
    }
  },
};

/* =============================== CHAT =================================== */
function hasImage(messages) {
  return messages.some(
    (m) => Array.isArray(m.content) && m.content.some((b) => b && (b.type === "image" || b.type === "image_url"))
  );
}

// Convert the frontend's Anthropic-style content into OpenAI-compatible content.
function toOpenAIContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return String(content ?? "");
  const parts = content.map((b) => {
    if (b.type === "text") return { type: "text", text: b.text || "" };
    if (b.type === "image" && b.source) {
      const url = `data:${b.source.media_type || "image/jpeg"};base64,${b.source.data}`;
      return { type: "image_url", image_url: { url } };
    }
    if (b.type === "image_url") return b;
    return { type: "text", text: "" };
  });
  return parts;
}

async function handleChat(request, env, json) {
  const body = await request.json().catch(() => ({}));
  const system = body.system || "";
  const rawMsgs = Array.isArray(body.messages) ? body.messages : [];
  const maxTokens = Math.min(Math.max(parseInt(body.max_tokens, 10) || 2000, 256), 4096);

  const vision = hasImage(rawMsgs);
  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  for (const m of rawMsgs) {
    let content = toOpenAIContent(m.content);
    // Groq (text model) expects plain strings — flatten any arrays.
    if (!vision && Array.isArray(content)) {
      content = content.filter((p) => p.type === "text").map((p) => p.text).join("\n");
    }
    messages.push({ role: m.role || "user", content });
  }

  let endpoint, headers, model, provider;
  if (vision) {
    if (!env.OPENROUTER_KEY) return json({ error: { message: "OPENROUTER_KEY not set", code: 500 } });
    endpoint = OPENROUTER_CHAT;
    model = env.VISION_MODEL || "moonshotai/kimi-k2.6";
    provider = "kimi";
    headers = {
      Authorization: `Bearer ${env.OPENROUTER_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://aidoctor.study",
      "X-Title": "AI Doctor Study",
    };
  } else {
    if (!env.GROQ_KEY) return json({ error: { message: "GROQ_KEY not set", code: 500 } });
    endpoint = GROQ_CHAT;
    model = env.GROQ_MODEL || "llama-3.3-70b-versatile";
    provider = "groq";
    headers = { Authorization: `Bearer ${env.GROQ_KEY}`, "Content-Type": "application/json" };
  }

  const resp = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, max_tokens: maxTokens, messages, temperature: 0.6 }),
  });
  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    const message =
      (data && data.error && (data.error.message || data.error)) ||
      (resp.status === 429 ? "AI busy — wait 20 seconds and retry" : "AI request failed");
    return json({ error: { message: String(message), code: resp.status } });
  }

  const reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || "").trim();
  if (!reply) return json({ error: { message: "Empty response — please try again", code: 502 } });
  return json({ reply, provider });
}

/* ============================ TRANSCRIBE =============================== */
async function handleTranscribe(request, env, json) {
  if (!env.GROQ_KEY) return json({ error: "GROQ_KEY not set in Worker" });
  const form = await request.formData();
  const audio = form.get("audio");
  if (!audio) return json({ error: "No audio file provided" });

  const language = form.get("language");
  const gf = new FormData();
  gf.append("file", audio, (audio && audio.name) || "audio.mp3");
  gf.append("model", "whisper-large-v3");
  gf.append("response_format", "json");
  if (language && language !== "auto") gf.append("language", String(language).split("-")[0]);

  const resp = await fetch(GROQ_TRANSCRIBE, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.GROQ_KEY}` },
    body: gf,
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) return json({ error: (data && data.error && data.error.message) || "Transcription failed" });
  return json({ transcript: data.text || "" });
}

/* ============================ GUMROAD ================================== */
async function handleGumroad(request, env, json) {
  const form = await request.formData();
  const p = Object.fromEntries(form.entries());
  const email = (p.email || "").trim().toLowerCase();
  if (!email) return json({ ok: false, reason: "no email" });

  const cancelled =
    p.resource_name === "cancellation" ||
    p.refunded === "true" ||
    p.cancelled === "true" ||
    p.subscription_ended_at || p.subscription_cancelled_at;

  const isPro = !cancelled;
  const proExpires = Date.now() + (parseInt(env.PRO_DAYS, 10) || 35) * 86400000;

  await firestoreWrite(env, "gumroad_users", email, {
    email: { stringValue: email },
    is_pro: { booleanValue: isPro },
    pro_expires: { integerValue: String(proExpires) },
    updated_at: { integerValue: String(Date.now()) },
  });

  return json({ ok: true, email, is_pro: isPro });
}

/* ============================ CHECK PRO =============================== */
async function handleCheckPro(request, env, json) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").trim().toLowerCase();
  if (!email) return json({ is_pro: false });

  const doc = await firestoreRead(env, "gumroad_users", email);
  if (!doc || !doc.fields) return json({ is_pro: false });

  const f = doc.fields;
  const isPro = f.is_pro && f.is_pro.booleanValue === true;
  const exp = f.pro_expires ? parseInt(f.pro_expires.integerValue, 10) : 0;
  return json({ is_pro: Boolean(isPro && exp > Date.now()) });
}

/* ===================== FIRESTORE (service account) ===================== */
let _tokenCache = { token: null, exp: 0 };

async function getAccessToken(env) {
  if (_tokenCache.token && _tokenCache.exp > Date.now() + 60000) return _tokenCache.token;

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: env.FIREBASE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: GOOGLE_TOKEN,
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`;
  const key = await importPrivateKey(env.FIREBASE_PRIVATE_KEY);
  const sig = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    new TextEncoder().encode(unsigned)
  );
  const jwt = `${unsigned}.${b64urlBytes(new Uint8Array(sig))}`;

  const resp = await fetch(GOOGLE_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const data = await resp.json();
  if (!data.access_token) throw new Error("Firebase token error: " + JSON.stringify(data));
  _tokenCache = { token: data.access_token, exp: Date.now() + (data.expires_in || 3600) * 1000 };
  return _tokenCache.token;
}

function docUrl(env, col, id) {
  const project = env.FIREBASE_PROJECT_ID;
  return `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${col}/${encodeURIComponent(id)}`;
}

async function firestoreWrite(env, col, id, fields) {
  const token = await getAccessToken(env);
  const resp = await fetch(docUrl(env, col, id), {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!resp.ok) throw new Error("Firestore write failed: " + (await resp.text()).slice(0, 120));
}

async function firestoreRead(env, col, id) {
  const token = await getAccessToken(env);
  const resp = await fetch(docUrl(env, col, id), { headers: { Authorization: `Bearer ${token}` } });
  if (resp.status === 404) return null;
  if (!resp.ok) throw new Error("Firestore read failed: " + (await resp.text()).slice(0, 120));
  return await resp.json();
}

/* ============================== crypto utils =========================== */
async function importPrivateKey(pem) {
  const clean = String(pem)
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    der.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function b64url(str) {
  return b64urlBytes(new TextEncoder().encode(str));
}
function b64urlBytes(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
