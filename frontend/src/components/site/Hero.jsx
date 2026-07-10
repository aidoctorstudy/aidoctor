import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GraduationCap, ArrowRight } from "lucide-react";
import { MagneticButton, CountUp, Reveal } from "./primitives";
import DnaHelix from "./DnaHelix";
import { fetchStats } from "./api";

const STATS = [
  { num: 100, suffix: "+", label: "Med Students", tiny: "up to" },
  { num: 8, suffix: "", label: "Subjects" },
  { label: "USMLE", static: true, sub: "PLAB Ready" },
  { label: "24/7", static: true, sub: "Always On" },
];

export default function Hero({ onSignup, onLogin }) {
  const [stats, setStats] = useState({ studying_now: 8, cards_today: 312, students_joined: 89 });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const helixY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const helixRotate = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const helixScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  useEffect(() => {
    fetchStats().then(setStats).catch(() => {});
    const id = setInterval(() => fetchStats().then(setStats).catch(() => {}), 15000);
    return () => clearInterval(id);
  }, []);

  const live = [
    { n: stats.studying_now, l: "Studying now", dot: true },
    { n: stats.cards_today, l: "Cards generated today" },
    { n: stats.students_joined, l: "Students joined" },
  ];

  return (
    <section ref={sectionRef} id="top" className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pt-36" data-testid="hero" style={{ perspective: 1200 }}>
      {/* ambient orbs */}
      <div className="orb animate-floaty" style={{ width: 460, height: 460, top: -120, right: -80, background: "rgba(37,99,235,0.28)" }} />
      <div className="orb animate-floaty" style={{ width: 360, height: 360, bottom: -60, left: -100, background: "rgba(6,182,212,0.20)", animationDelay: "3s" }} />
      <div className="orb animate-floaty" style={{ width: 280, height: 280, top: "40%", left: "45%", background: "rgba(110,231,183,0.12)", animationDelay: "6s" }} />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT */}
        <motion.div style={{ y: textY }} className="text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--bd2)] bg-[var(--p)]/10 px-4 py-1.5 text-xs font-bold tracking-wide text-[var(--pl)]">
              <GraduationCap className="h-4 w-4" /> Built for Medical Students
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-h mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              The <span className="grad-text">AI Study Tool</span>
              <br className="hidden sm:block" /> for Medical Students
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--tx2)] sm:text-lg lg:mx-0">
              Anatomy, Pharmacology, Pathology, Clinical Cases — all explained by AI,
              personalized to your year and exam type.
            </p>
          </Reveal>

          {/* live counters */}
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" data-testid="live-counters">
              {live.map((c, i) => (
                <div key={i} className="glass glow-hover flex items-center gap-2.5 rounded-2xl px-4 py-2.5">
                  {c.dot && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ok)] opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ok)]" /></span>}
                  <span className="font-h text-lg font-bold grad-text">{(c.n ?? 0).toLocaleString()}</span>
                  <span className="text-xs text-[var(--tx2)]">{c.l}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-8 flex flex-wrap justify-center gap-3.5 lg:justify-start">
              <MagneticButton
                onClick={onSignup} data-testid="hero-signup-btn"
                className="btn-primary group flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold"
              >
                Start For Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
              <MagneticButton
                onClick={onLogin} data-testid="hero-login-btn"
                className="rounded-full border border-[var(--bd2)] bg-[var(--surface2)] px-8 py-4 text-base font-bold text-[var(--tx)]"
              >
                Log In
              </MagneticButton>
            </div>
          </Reveal>

          {/* stats row */}
          <Reveal delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start" data-testid="hero-stats">
              {STATS.map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="font-h text-2xl font-bold grad-text">
                    {s.static ? s.label : <><CountUp to={s.num} suffix={s.suffix} /></>}
                  </div>
                  <div className="text-xs font-semibold text-[var(--tx3)]">{s.static ? s.sub : s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>

        {/* RIGHT — DNA helix */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: helixY, rotateY: helixRotate, scale: helixScale, transformStyle: "preserve-3d" }}
          className="relative mx-auto h-[380px] w-full max-w-md sm:h-[520px]"
        >
          <div className="ring-glow absolute inset-4 rounded-[40px]" />
          <DnaHelix className="h-full w-full" />
          <div className="pointer-events-none absolute -bottom-4 left-1/2 h-24 w-64 -translate-x-1/2 rounded-full bg-[var(--p2)]/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
