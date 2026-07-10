import { useRef, useEffect } from "react";

/**
 * Holographic rotating node-sphere. Fibonacci-distributed points on a sphere,
 * rotated in 3D and projected with perspective. Neighbouring nodes are linked.
 * Pure canvas — no three.js. Reacts subtly to the mouse.
 */
export default function NodeSphere({ className = "" }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext("2d");
    let raf, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let ry = 0, rx = 0.35;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // fibonacci sphere
    const N = 130;
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    function resize() {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    function draw() {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.36;
      const focal = 2.2;

      ry += reduce ? 0 : 0.0032;
      const tx = rx + mouse.current.y * 0.4;
      const ty = ry + mouse.current.x * 0.6;

      const proj = pts.map((p) => {
        // rotate Y
        let x = p.x * Math.cos(ty) - p.z * Math.sin(ty);
        let z = p.x * Math.sin(ty) + p.z * Math.cos(ty);
        let y = p.y;
        // rotate X
        const y2 = y * Math.cos(tx) - z * Math.sin(tx);
        const z2 = y * Math.sin(tx) + z * Math.cos(tx);
        y = y2; z = z2;
        const scale = focal / (focal - z);
        return { sx: cx + x * R * scale, sy: cy + y * R * scale, z, scale, depth: (z + 1) / 2 };
      });

      // links
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, dz = pts[i].z - pts[j].z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < 0.42) {
            const depth = (proj[i].depth + proj[j].depth) / 2;
            ctx.strokeStyle = `rgba(6,182,212,${0.04 + depth * 0.22})`;
            ctx.lineWidth = 0.5 + depth * 0.7;
            ctx.beginPath();
            ctx.moveTo(proj[i].sx, proj[i].sy);
            ctx.lineTo(proj[j].sx, proj[j].sy);
            ctx.stroke();
          }
        }
      }

      // nodes
      proj.sort((a, b) => a.depth - b.depth);
      for (const n of proj) {
        const r = (1 + n.depth * 3.4) * n.scale;
        const a = 0.2 + n.depth * 0.8;
        const g = ctx.createRadialGradient(n.sx, n.sy, 0, n.sx, n.sy, r * 3.5);
        const em = n.depth > 0.6;
        const col = em ? "16,185,129" : "6,182,212";
        g.addColorStop(0, `rgba(${col},${a})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(n.sx, n.sy, r * 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${a * 0.9})`;
        ctx.beginPath(); ctx.arc(n.sx, n.sy, r * 0.6, 0, Math.PI * 2); ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    function onMouse(e) {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMouse);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`} data-testid="node-sphere">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
