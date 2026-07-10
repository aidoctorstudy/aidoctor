import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Reveal } from "./primitives";
import { PRICING, GUMROAD_URL, STUDENT_CODE } from "./content";

function Item({ children }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-[var(--tx2)]">
      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ok)]" />
      <span>{children}</span>
    </li>
  );
}

export default function Pricing({ onSignup }) {
  const { free, pro } = PRICING;
  return (
    <section id="pricing" className="relative px-5 py-24 sm:px-8" data-testid="pricing-section">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--p2)]">Pricing</div>
          <h2 className="font-h mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Invest in your medical career</h2>
          <p className="mt-4 text-[var(--tx2)]">Less than a textbook. Worth more than any notes.</p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-2">
          {/* FREE */}
          <Reveal>
            <div className="glass glow-hover flex h-full flex-col rounded-3xl p-8" data-testid="pricing-free">
              <div className="text-sm font-bold text-[var(--tx2)]">{free.name}</div>
              <div className="font-h mt-2 text-5xl font-semibold">{free.amount}</div>
              <div className="mt-1 text-sm text-[var(--tx3)]">{free.period}</div>
              <ul className="mt-6 space-y-3">{free.features.map((f) => <Item key={f}>{f}</Item>)}</ul>
              <button
                onClick={onSignup} data-testid="pricing-free-btn"
                className="mt-auto w-full rounded-full border border-[var(--bd2)] bg-[var(--surface2)] py-3.5 text-sm font-bold text-[var(--tx)] transition-colors hover:bg-[var(--card-hover)]"
              >
                Get Started Free
              </button>
            </div>
          </Reveal>

          {/* PRO */}
          <Reveal delay={0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative flex h-full flex-col rounded-3xl p-8 animate-pulse-glow"
              style={{
                background: "linear-gradient(160deg, rgba(37,99,235,0.16), rgba(6,182,212,0.10))",
                border: "1px solid rgba(6,182,212,0.35)",
                boxShadow: "0 0 0 1px rgba(6,182,212,0.15), 0 24px 70px rgba(6,182,212,0.18)",
              }}
              data-testid="pricing-pro"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="btn-primary inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-white" /> Best for Med Students
                </span>
              </div>
              <div className="mt-2 text-sm font-bold text-[var(--pl)]">{pro.name}</div>
              <div className="font-h mt-2 flex items-end gap-1 text-5xl font-semibold">
                {pro.amount}<span className="mb-1.5 text-base font-medium text-[var(--tx2)]">{pro.per}</span>
              </div>
              <div className="mt-1 text-sm text-[var(--tx3)]">{pro.period}</div>
              <ul className="mt-6 space-y-3">{pro.features.map((f) => <Item key={f}>{f}</Item>)}</ul>
              <button
                onClick={() => window.open(GUMROAD_URL, "_blank")} data-testid="pricing-pro-btn"
                className="btn-primary mt-auto w-full rounded-full py-3.5 text-sm font-bold"
              >
                Get Pro on Gumroad
              </button>
            </motion.div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-8 text-center text-sm text-[var(--tx2)]">
          Student code <span className="rounded-md bg-[var(--gold)]/15 px-2 py-1 font-bold text-[var(--gold)]">{STUDENT_CODE}</span> for 20% off
        </Reveal>
      </div>
    </section>
  );
}
