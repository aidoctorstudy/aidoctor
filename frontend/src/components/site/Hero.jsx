import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { MagneticButton, CountUp } from "./primitives";
import DnaHelix from "./DnaHelix";
import { fetchStats } from "./api";

const STATS = [
  { num: 100, suffix: "+", label: "Med Students" },
  { num: 8, suffix: "", label: "Subjects" },
  { text: "USMLE", label: "PLAB Ready" },
  { text: "24/7", label: "Always On" },
];

export default function Hero({ onSignup, onLogin }) {
  const [stats, setStats] = useState({ studying_now: 8, cards_today: 312, students_joined: 89 });

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
    const id = setInterval(() => fetchStats().then(setStats).catch(() => {}), 15000);
    return () => clearInterval(id);
  }, []);

  const live = [
    { n: stats.studying_now, l: "studying now", dot: true },
    { n: stats.cards_today, l: "cards today" },
    { n: stats.students_joined, l: "students joined" },
  ];

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pb-24 pt-36 text-center" data-testid="hero">
      {/* floating 3D DNA helix (green + cyan glow) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="relative h-[115%] w-[420px] max-w-[80vw] opacity-70" style={{ maskImage: "radial-gradient(ellipse 60% 55% at 50% 50%, #000 30%, transparent 78%)", WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 50%, #000 30%, transparent 78%)" }}>
          <DnaHelix className="h-full w-full" />
        </div>
      </div>
      {/* aurora */}
      <div className="aurora animate-floaty" style={{ width: 520, height: 520, top: -120, left: "12%", background: "rgba(6,182,212,0.20)" }} />
      <div className="aurora animate-floaty" style={{ width: 460, height: 460, bottom: -140, right: "10%", background: "rgba(16,185,129,0.16)", animationDelay: "4s" }} />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.span
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="crystal inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-[var(--tx2)]"
        >
          <GraduationCap className="h-4 w-4 text-[var(--cyan)]" /> Built for Medical Students
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.08, ease }}
          className="font-h mt-7 text-[2.75rem] font-extrabold leading-[0.98] tracking-tighter sm:text-7xl lg:text-[5.5rem]"
        >
          <span className="ink-text">The </span>
          <span className="grad-text">AI Study Tool</span>{" "}
          <br />
          <span className="ink-text">for Medical Students</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16, ease }}
          className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--tx2)] sm:text-lg"
        >
          Anatomy, Pharmacology, Pathology, Clinical Cases — explained by AI, personalized to your year and exam type.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
        >
          <MagneticButton onClick={onSignup} data-testid="hero-signup-btn" className="btn-white group flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold">
            <Sparkles className="h-4 w-4" /> Start For Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
          <MagneticButton onClick={onLogin} data-testid="hero-login-btn" className="btn-glass rounded-full px-8 py-4 text-base font-bold">
            Log In
          </MagneticButton>
        </motion.div>

        {/* live counters (mono) */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.36 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2.5" data-testid="live-counters"
        >
          {live.map((c, i) => (
            <div key={i} className="crystal flex items-center gap-2 rounded-full px-4 py-2">
              {c.dot && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--emerald)] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--emerald)]" /></span>}
              <span className="font-mono2 text-sm font-bold text-[var(--cyan)]">{(c.n ?? 0).toLocaleString()}</span>
              <span className="text-xs text-[var(--tx2)]">{c.l}</span>
            </div>
          ))}
        </motion.div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-4 border-t border-[var(--bd)] pt-8" data-testid="hero-stats"
        >
          {STATS.map((s, i) => (
            <div key={i}>
              <div className="font-mono2 text-xl font-bold text-[var(--tx)] sm:text-2xl">
                {s.text ? s.text : <CountUp to={s.num} suffix={s.suffix} />}
              </div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--tx3)]">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
