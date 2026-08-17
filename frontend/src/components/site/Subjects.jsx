import { motion } from "framer-motion";
import { Reveal } from "./primitives";
import { SUBJECTS } from "./content";

// bento: give a couple of tiles extra width for asymmetry
const SPANS = ["sm:col-span-2", "", "", "", "", "sm:col-span-2", "", ""];

export default function Subjects() {
  return (
    <section id="subjects" className="relative px-5 py-28 sm:px-8" data-testid="subjects-section">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-0 flex justify-center">
        <div className="aurora" style={{ width: 500, height: 300, background: "rgba(16,185,129,0.10)" }} />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="font-mono2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--cyan)]">Subjects</div>
          <h2 className="font-h mt-4 text-3xl font-extrabold tracking-tighter sm:text-5xl">All core medical subjects</h2>
          <p className="mt-4 text-[var(--tx2)]">From pre-clinical to clinical years — every subject covered.</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SUBJECTS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 4) * 0.05} className={SPANS[i]}>
                <motion.div
                  whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 240, damping: 20 }}
                  className="holo-card group flex h-full items-center gap-4 rounded-[22px] p-5"
                  data-testid={`subject-card-${i}`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface2)] ring-1 ring-[var(--bd2)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(6,182,212,0.5)]">
                    <Icon className="h-6 w-6 text-[var(--cyan)] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  </div>
                  <div>
                    <h3 className="font-h text-base font-bold tracking-tight">{s.title}</h3>
                    <p className="text-xs text-[var(--tx3)]">{s.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
