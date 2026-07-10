import { Reveal, TiltCard } from "./primitives";
import { SUBJECTS } from "./content";

export default function Subjects() {
  return (
    <section id="subjects" className="relative bg-[var(--surface2)] px-5 py-24 sm:px-8" data-testid="subjects-section">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--p2)]">Subjects</div>
          <h2 className="font-h mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">All core medical subjects</h2>
          <p className="mt-4 text-[var(--tx2)]">From pre-clinical to clinical years — every subject covered.</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={(i % 4) * 0.06}>
                <TiltCard
                  intensity={12}
                  className="glass glow-hover conic-glow group flex h-full flex-col items-start rounded-3xl p-6 transition-colors duration-300 hover:bg-[var(--card-hover)]"
                  data-testid={`subject-card-${i}`}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--p)]/20 to-[var(--p2)]/20 ring-1 ring-[var(--bd2)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.55)]" style={{ transform: "translateZ(55px)" }}>
                    <Icon className="h-7 w-7 text-[var(--pl)]" />
                  </div>
                  <h3 className="font-h text-lg font-semibold" style={{ transform: "translateZ(35px)" }}>{s.title}</h3>
                  <p className="mt-1 text-sm text-[var(--tx3)]" style={{ transform: "translateZ(20px)" }}>{s.desc}</p>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
