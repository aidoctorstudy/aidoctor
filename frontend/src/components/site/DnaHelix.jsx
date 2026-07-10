import { useRef, useEffect } from "react";

/**
 * Canvas-based rotating double-helix (DNA).
 * Pure 2.5D projection — no three.js dependency, smooth on React 19.
 * Reacts subtly to mouse via the `tilt` prop (x in -1..1).
 */
export default function DnaHelix({ className = "" }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const tilt = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const N = 46;
    const lerp = (a, b, p) => a + (b - a) * p;

    function draw() {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const radius = Math.min(w * 0.28, 150);
      const topPad = h * 0.08;
      const usableH = h * 0.84;
      const twist = 3.4;
      const wobble = tilt.current * 0.5;

      const nodes = [];
      for (let i = 0; i < N; i++) {
        const p = i / (N - 1);
        const y = topPad + p * usableH;
        const angle = p * Math.PI * twist + t + wobble;
        for (let s = 0; s < 2; s++) {
          const a = angle + s * Math.PI;
          const x = cx + Math.sin(a) * radius;
          const depth = (Math.cos(a) + 1) / 2; // 0 back .. 1 front
          nodes.push({ x, y, depth, p, strand: s, i });
        }
      }

      // rungs (behind spheres)
      for (let i = 0; i < N; i += 2) {
        const A = nodes[i * 2];
        const B = nodes[i * 2 + 1];
        const depth = (A.depth + B.depth) / 2;
        const g = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
        g.addColorStop(0, `rgba(96,165,250,${0.15 + depth * 0.4})`);
        g.addColorStop(1, `rgba(110,231,183,${0.15 + depth * 0.4})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1 + depth * 1.6;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }

      // spheres sorted by depth (painter's algorithm)
      nodes.sort((a, b) => a.depth - b.depth);
      for (const n of nodes) {
        const r = 2.4 + n.depth * 5.2;
        const alpha = 0.25 + n.depth * 0.75;
        const cr = Math.round(lerp(37, 6, n.p));
        const cg = Math.round(lerp(99, 182, n.p));
        const cb = Math.round(lerp(235, 212, n.p));
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.6);
        glow.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
        glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${cr + 40},${cg + 40},${cb + 20},${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) t += 0.012;
      raf = requestAnimationFrame(draw);
    }
    draw();

    function onMouse(e) {
      const r = wrap.getBoundingClientRect();
      tilt.current = ((e.clientX - r.left) / r.width - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`} data-testid="dna-helix">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
