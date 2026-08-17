# PRD — AI Doctor (aidoctor.study)

## Original Problem Statement
User continued a project from a previous (credit-exhausted) account. They uploaded their entire existing
"AI Doctor" static site (14 files: index.html, styles.css, auth.js + 12 JS modules for a medical study
platform) and asked to rebuild it as a **"full 3D, Apple-level website"** — mouse tilt, scroll-driven
animations, floating DNA helix, magnetic hovers, glassmorphism.

Note: previous account's files were NOT accessible in this workspace; brand/content was recovered from the
user-uploaded artifacts.

## Product
AI Doctor — an AI-powered medical study platform for MBBS / USMLE / PLAB / nursing students.
Tagline: "The AI Study Tool for Medical Students". Footer: "Study smarter. Save lives."

## User Personas
- Pre-clinical & clinical med students (MBBS) wanting AI explanations & flashcards.
- USMLE / PLAB / NEET-PG exam candidates.
- Nursing students.

## Architecture
- Frontend: React (CRA) + Tailwind + shadcn/ui + framer-motion. Canvas-based 3D DNA helix (no three.js).
- Backend: FastAPI + MongoDB (motor). All routes under /api.
- Brand tokens in `src/index.css` (dark-first, blue→cyan gradient, Outfit headings + Inter body).
- Components in `src/components/site/`: Navbar, Hero, Features, Subjects, Pricing, Reviews, Faq, Footer,
  SignupDialog, primitives (TiltCard, MagneticButton, CountUp, Reveal), DnaHelix.

## What's Been Implemented (2026-07-10)
- Apple-level 3D landing page: rotating glowing DNA helix, mouse-tilt feature cards w/ glare,
  magnetic hover CTAs, scroll-reveal stagger, animated count-up stats, glassmorphic nav (transparent→glass),
  dark/light theme toggle (persisted).
- Sections: Hero (live counters + stats), Features (8), Subjects (8), Pricing (Free vs Pro glowing),
  Reviews (from DB), FAQ (accordion), Footer. Gumroad Pro CTA + MED20 student code.
- Backend: GET /api/stats (live vanity counters), GET/POST /api/reviews (6 seeded), POST /api/waitlist
  (lead capture with email validation). Log In / Start Free open a waitlist capture dialog.
- Tested: backend 100%, frontend 100% (testing_agent iteration_1).

## Prioritized Backlog
- P0: (done) Premium 3D landing page + waitlist capture.
- P1: Real authentication + the actual study app (the 12 uploaded JS modules: lecture summaries, flashcards/SRS,
  quiz engine, clinical case solver, exam prep, medical tools). Requires an LLM integration (Emergent LLM key)
  and an auth decision (JWT vs Emergent Google login). Original used Firebase — needs porting to this stack.
- P2: Admin/moderation for reviews; analytics; Stripe/native checkout as alternative to Gumroad.

## Next Tasks
- Port the authenticated study app (AI features) onto React + FastAPI + Emergent LLM key.
- Add auth (via integration_playbook_expert_v2).

## Deployment Fix (2026-07-10) — Vercel blank/"blue" screen RESOLVED
- **Symptom:** Vercel production (aidoctorstudy.vercel.app / aidoctor.study) showed a blank dark-navy
  screen with only the Emergent badge, despite deployment Status = Ready. Local build always worked.
- **Root cause:** `Reviews.jsx` called `fetchReviews().then(setReviews)` then `reviews.map(...)`. On Vercel
  the FastAPI backend is NOT deployed and `REACT_APP_BACKEND_URL` is unset, so the request resolved to
  `/undefined/api/reviews` → SPA rewrite returned `index.html` (a STRING) with HTTP 200 → `reviews` became
  a string → `reviews.map` threw `r.map is not a function` → whole React tree crashed → blank screen.
- **Fix (frontend now self-contained; backend is optional live enhancement):**
  - `content.js`: added `DEFAULT_REVIEWS` (6 bundled med-student reviews).
  - `api.js`: `API` is null when `REACT_APP_BACKEND_URL` is absent; `fetchReviews` always returns an array,
    `fetchStats` always returns a plain object or null (shape-validated, try/catch, 8s timeout).
  - `Reviews.jsx`: seeds state with `DEFAULT_REVIEWS`, only replaces on a valid non-empty array, guards `.map`.
  - `Hero.jsx`: merges live stats into the default object; never overwrites with a bad shape.
  - `frontend/package.json`: pinned `"engines": { "node": "20.x" }` (React 19 needs Node 18+; future-proofs Vercel builds).
- **Verified:** Rebuilt with `REACT_APP_BACKEND_URL=""` (exact Vercel condition) → renders fully, ZERO page
  errors (was 1 crash before). Vercel Root Directory = `frontend` is CORRECT.
- **User action required:** Push to GitHub via "Save to Github" so Vercel redeploys the fixed commit.

## Launch: Legal + SEO (2026-07-10)
- **Legal pages (static HTML, crawler-friendly, dark-theme styled):**
  - `public/privacy.html` — prominent Medical & AI Disclaimer (AI can be wrong, not medical advice,
    use at own risk, no-liability), data collection (waitlist email, Firebase accounts), GDPR rights,
    cookies, third parties (Firebase/Gumroad/AI providers), contact studevoai@gmail.com.
  - `public/terms.html` — educational-use-only disclaimer, acceptable use, subscriptions (Gumroad Pro),
    AS-IS warranty disclaimer, Limitation of Liability, indemnification, generic governing law.
  - Footer links added (`footer-privacy`, `footer-terms`).
- **SEO / AI discoverability:**
  - `index.html`: canonical, keywords, Open Graph (og:title/description/image/url/site_name), Twitter card,
    JSON-LD @graph (Organization + WebSite + SoftwareApplication with Free/Pro offers). og:image = /aidoctor-logo.png.
  - `public/robots.txt`: allows all + explicit AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
    Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended) + Sitemap ref.
  - `public/sitemap.xml`: home, /app/, privacy, terms.
  - `public/llms.txt`: AI-assistant index describing product, features, subjects, disclaimer, links.
  - IndexNow key file: `public/fc8ff56c23cefdf3d10a12854453f357.txt` (key: fc8ff56c23cefdf3d10a12854453f357).
  - Root+frontend `vercel.json` rewrites now exclude dotted files (static SEO files always serve).
- **Verified:** all files serve on preview with correct content-types; OG/JSON-LD present in served HTML;
  privacy page renders (screenshot). 
- **User actions (need their login):** Google Search Console + Bing Webmaster Tools verification & sitemap
  submission; IndexNow ping. Ranking/AI-answer inclusion takes days–weeks after indexing.

## Signup consent (2026-07-10)
- Added an "I accept the Terms of Service and Privacy Policy" checkbox (`#medAcceptTerms`) to the static
  app signup form (`public/app/index.html`), with links to /terms.html and /privacy.html + AI/medical
  disclaimer text. Shown in Sign Up mode, hidden in Log In mode.
- Gate enforced on ALL signup entry points: `01-core-utils.js` startBtn handler (the DEFAULT active one —
  it overrides the inline onclick), plus `auth.js signUpEmail()` and `signInWithGoogle()` (signup mode).
  Blocks with error until checked.
- Verified via browser automation: unchecked → blocked + error; checked → enters app.
