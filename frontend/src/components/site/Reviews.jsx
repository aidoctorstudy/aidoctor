import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Reveal } from "./primitives";
import { fetchReviews } from "./api";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Reviews({ onSignup }) {
  const [reviews, setReviews] = useState([]);
  useEffect(() => { fetchReviews().then(setReviews).catch(() => setReviews([])); }, []);

  return (
    <section className="relative overflow-hidden px-5 py-28 sm:px-8" data-testid="reviews-section">
      {/* dark image texture backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.12]"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1690788210614-9052cffd8a14?crop=entropy&cs=srgb&fm=jpg&q=70&w=1600)",
          backgroundSize: "cover", backgroundPosition: "center",
          maskImage: "linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent)",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="font-mono2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--cyan)]">Student Reviews</div>
          <h2 className="font-h mt-4 text-3xl font-extrabold tracking-tighter sm:text-5xl">Loved by medical students</h2>
          <p className="mt-4 text-[var(--tx2)]">Real words from students grinding through the same exams as you.</p>
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id || i} delay={(i % 3) * 0.07}>
              <motion.div
                whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 240, damping: 20 }}
                className="crystal group relative h-full rounded-[24px] p-6" data-testid={`review-card-${i}`}
              >
                <Quote className="absolute right-5 top-5 h-7 w-7 text-[var(--cyan)]/20" />
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: r.rating || 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-[var(--emerald)] text-[var(--emerald)]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[var(--tx)]">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--emerald)] text-sm font-bold text-black">
                    {initials(r.name)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--tx)]">{r.name}</div>
                    <div className="text-xs text-[var(--tx3)]">{r.role}</div>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-14 text-center">
          <button onClick={onSignup} data-testid="reviews-cta-btn" className="btn-white rounded-full px-8 py-4 text-base font-bold">
            Join thousands of students →
          </button>
        </Reveal>
      </div>
    </section>
  );
}
