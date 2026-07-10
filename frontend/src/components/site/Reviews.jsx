import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Reveal, TiltCard } from "./primitives";
import { fetchReviews } from "./api";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Reviews({ onSignup }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews().then(setReviews).catch(() => setReviews([]));
  }, []);

  return (
    <section className="relative px-5 py-24 sm:px-8" data-testid="reviews-section">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--p2)]">Student Reviews</div>
          <h2 className="font-h mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Loved by medical students</h2>
          <p className="mt-4 text-[var(--tx2)]">Real words from students grinding through the same exams as you.</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id || i} delay={(i % 3) * 0.08}>
              <TiltCard intensity={6} className="glass h-full rounded-3xl p-6" data-testid={`review-card-${i}`}>
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: r.rating || 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[var(--tx)]">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--p)] to-[var(--p2)] text-sm font-bold text-white">
                    {initials(r.name)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[var(--tx)]">{r.name}</div>
                    <div className="text-xs text-[var(--tx3)]">{r.role}</div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12 text-center">
          <button
            onClick={onSignup} data-testid="reviews-cta-btn"
            className="btn-primary rounded-full px-8 py-4 text-base font-bold"
          >
            Join thousands of students →
          </button>
        </Reveal>
      </div>
    </section>
  );
}
