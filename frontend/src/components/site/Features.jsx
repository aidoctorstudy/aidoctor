import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./primitives";
import { FEATURES } from "./content";

function SectionHead({ tag, title, sub }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <div className="font-mono2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--cyan)]">{tag}</div>
      <h2 className="font-h mt-4 text-3xl font-extrabold tracking-tighter sm:text-5xl">{title}</h2>
      <p className="mt-4 text-[var(--tx2)]">{sub}</p>
    </Reveal>
  );
}

export default function Features() {
  const [hero, ...rest] = FEATURES;
  const HeroIcon = hero.icon;

  return (
    <section id="features" className="relative px-5 py-28 sm:px-8" data-testid="features-section">
      <div className="mx-auto max-w-6xl">
        <SectionHead tag="Features" title="Built for medical school" sub="Every tool designed specifically for MBBS, nursing and med-school students." />

        <div className="mt-16 grid auto-rows-[minmax(0,1fr)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Signature feature — spans big */}
          <Reveal className="sm:col-span-2 lg:row-span-2">
            <motion.div
              whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="trace-border holo-card group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-[28px] p-8"
              data-testid="feature-card-0"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--cyan)]/15 blur-3xl" />
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--cyan)]/25 to-[var(--emerald)]/25 ring-1 ring-[var(--bd2)]">
                  <HeroIcon className="h-7 w-7 text-[var(--cyan)] drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                </div>
                <h3 className="font-h mt-6 text-2xl font-bold tracking-tight sm:text-3xl">{hero.title}</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--tx2)]">{hero.desc}</p>
              </div>
              <div className="relative mt-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--cyan)]">
                Try a case <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.div>
          </Reveal>

          {rest.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className="holo-card group flex h-full flex-col rounded-[24px] p-6"
                  data-testid={`feature-card-${i + 1}`}
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface2)] ring-1 ring-[var(--bd2)] transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-[var(--cyan)] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  </div>
                  <h3 className="font-h text-lg font-bold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--tx2)]">{f.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
