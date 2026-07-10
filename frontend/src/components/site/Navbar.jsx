import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { NAV_LINKS } from "./content";
import LogoMark from "./Logo";

export default function Navbar({ theme, toggleTheme, onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      data-testid="navbar"
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav className={`mx-auto flex max-w-5xl items-center justify-between rounded-full px-4 py-2.5 pl-5 transition-all duration-300 ${
        scrolled ? "crystal" : "border border-transparent"
      }`}>
        <a href="#top" className="flex items-center gap-2.5" data-testid="nav-logo">
          <LogoMark className="h-9 w-9 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <span className="font-h text-lg font-extrabold tracking-tight">AI Doctor</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href} href={l.href} data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="text-sm font-semibold text-[var(--tx2)] transition-colors hover:text-[var(--tx)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme} data-testid="theme-toggle" aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--bd2)] text-[var(--tx2)] transition-colors hover:text-[var(--tx)]"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={onLogin} data-testid="nav-login-btn" className="hidden rounded-full px-4 py-2 text-sm font-bold text-[var(--tx2)] transition-colors hover:text-[var(--tx)] sm:block">
            Log In
          </button>
          <button onClick={onSignup} data-testid="nav-signup-btn" className="btn-white hidden rounded-full px-5 py-2 text-sm font-bold sm:block">
            Start Free
          </button>
          <button onClick={() => setOpen((v) => !v)} data-testid="mobile-menu-btn" className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--bd2)] text-[var(--tx)] md:hidden">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="crystal mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl p-3 md:hidden"
            data-testid="mobile-menu"
          >
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--tx2)] hover:bg-[var(--surface2)]">
                {l.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button onClick={() => { setOpen(false); onLogin(); }} className="btn-glass rounded-full py-2.5 text-sm font-bold">Log In</button>
              <button onClick={() => { setOpen(false); onSignup(); }} className="btn-white rounded-full py-2.5 text-sm font-bold">Start Free</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
