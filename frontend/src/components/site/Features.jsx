import { TiltCard, Reveal } from "./primitives";
import { FEATURES } from "./content";

export default function Features() {
  return (
    <section id="features" className="relative px-5 py-24 sm:px-8" data-testid="features-section">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--p2)]">Features</div>
          <h2 className="font-h mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Built for medical school</h2>
          <p className="mt-4 text-[var(--tx2)]">Every feature designed specifically for MBBS, nursing and med school students.</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 4) * 0.06}>
                <TiltCard className="glass glow-hover conic-glow group h-full rounded-3xl p-6 transition-colors duration-300 hover:bg-[var(--card-hover)]" data-testid={`feature-card-${i}`}>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--p)]/25 to-[var(--p2)]/25 ring-1 ring-[var(--bd2)] transition-shadow duration-300 group-hover:shadow-[0_0_28px_rgba(6,182,212,0.55)]" style={{ transform: "translateZ(60px)" }}>
                    <Icon className="h-6 w-6 text-[var(--pl)]" />
                  </div>
                  <h3 className="font-h text-lg font-semibold" style={{ transform: "translateZ(42px)" }}>{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--tx2)]" style={{ transform: "translateZ(24px)" }}>{f.desc}</p>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
