import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Reveal } from "./primitives";
import { PRICING, GUMROAD_URL } from "./content";

function Item({ children, pro }) {
  return (
    <li className="flex items-start gap-3 text-sm text-[var(--tx2)]">
      <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${pro ? "bg-[var(--emerald)]/20" : "bg-[var(--surface2)]"}`}>
        <Check className={`h-3 w-3 ${pro ? "text-[var(--emerald)]" : "text-[var(--cyan)]"}`} />
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function Pricing({ onSignup }) {
  const { free, pro } = PRICING;
  return (
    <section id="pricing" className="relative overflow-hidden px-5 py-28 sm:px-8" data-testid="pricing-section">
      <div className="aurora" style={{ width: 600, height: 400, top: "20%", left: "50%", transform: "translateX(-50%)", background: "rgba(6,182,212,0.12)" }} />
      <div className="relative mx-auto max-w-4xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="font-mono2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--cyan)]">Pricing</div>
          <h2 className="font-h mt-4 text-3xl font-extrabold tracking-tighter sm:text-5xl">Invest in your medical career</h2>
          <p className="mt-4 text-[var(--tx2)]">Less than a textbook. Worth more than any notes.</p>
        </Reveal>

        <div className="mt-16 grid items-stretch gap-5 md:grid-cols-2">
          <Reveal>
            <div className="crystal flex h-full flex-col rounded-[28px] p-8" data-testid="pricing-free">
              <div className="font-mono2 text-xs font-bold uppercase tracking-widest text-[var(--tx2)]">{free.name}</div>
              <div className="font-h mt-3 text-5xl font-extrabold tracking-tighter">{free.amount}</div>
              <div className="mt-1 text-sm text-[var(--tx3)]">{free.period}</div>
              <ul className="mt-7 space-y-3.5">{free.features.map((f) => <Item key={f}>{f}</Item>)}</ul>
              <button onClick={onSignup} data-testid="pricing-free-btn" className="btn-glass mt-auto w-full rounded-full py-3.5 text-sm font-bold">
                Get Started Free
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <motion.div
              whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="trace-border relative flex h-full flex-col overflow-hidden rounded-[28px] bg-[var(--bg2)] p-8 animate-pulse-glow"
              data-testid="pricing-pro"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[var(--emerald)]/15 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div className="font-mono2 text-xs font-bold uppercase tracking-widest text-[var(--cyan)]">{pro.name}</div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cyan)]/15 px-3 py-1 text-[11px] font-bold text-[var(--cyan)]">
                  <Star className="h-3 w-3 fill-[var(--cyan)]" /> Best for Med Students
                </span>
              </div>
              <div className="font-h mt-3 flex items-end gap-1 text-5xl font-extrabold tracking-tighter">
                {pro.amount}<span className="mb-1.5 text-base font-medium text-[var(--tx2)]">{pro.per}</span>
              </div>
              <div className="mt-1 text-sm text-[var(--tx3)]">{pro.period}</div>
              <ul className="mt-7 space-y-3.5">{pro.features.map((f) => <Item key={f} pro>{f}</Item>)}</ul>
              <button onClick={() => window.open(GUMROAD_URL, "_blank")} data-testid="pricing-pro-btn" className="btn-white mt-auto w-full rounded-full py-3.5 text-sm font-bold">
                Get Pro on Gumroad
              </button>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
