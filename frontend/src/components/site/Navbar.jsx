import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Stethoscope, Menu, X } from "lucide-react";
import { NAV_LINKS } from "./content";

export default function Navbar({ theme, toggleTheme, onLogin, onSignup }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      data-testid="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "glass-strong border-b border-[var(--bd)]" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5" data-testid="nav-logo">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--p)] to-[var(--p2)] shadow-[0_6px_20px_rgba(37,99,235,0.45)]">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="font-h text-xl font-bold grad-text">AI Doctor</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
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
          <button
            onClick={onLogin} data-testid="nav-login-btn"
            className="hidden rounded-full border border-[var(--bd2)] px-5 py-2 text-sm font-bold text-[var(--tx2)] transition-colors hover:text-[var(--tx)] sm:block"
          >
            Log In
          </button>
          <button
            onClick={onSignup} data-testid="nav-signup-btn"
            className="btn-primary hidden rounded-full px-5 py-2 text-sm font-bold sm:block"
          >
            Start Free
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)} data-testid="mobile-menu-btn"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--bd2)] text-[var(--tx)] md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--bd)] glass-strong md:hidden"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--tx2)] hover:bg-[var(--surface2)]"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={() => { setMobileOpen(false); onLogin(); }} className="rounded-full border border-[var(--bd2)] py-2.5 text-sm font-bold text-[var(--tx)]">Log In</button>
                <button onClick={() => { setMobileOpen(false); onSignup(); }} className="btn-primary rounded-full py-2.5 text-sm font-bold">Start Free</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
