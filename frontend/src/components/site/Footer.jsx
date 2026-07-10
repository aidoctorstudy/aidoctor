import { NAV_LINKS, CONTACT_EMAIL } from "./content";
import LogoMark from "./Logo";

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--bd)] px-5 py-16 sm:px-8" data-testid="footer">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-3">
          <LogoMark className="h-11 w-11 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]" />
          <span className="font-h text-2xl font-extrabold tracking-tight">AI Doctor</span>
        </div>
        <p className="font-h text-lg font-medium tracking-tight text-[var(--tx2)]">Study smarter. Save lives.</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="font-semibold text-[var(--tx2)] transition-colors hover:text-[var(--cyan)]">{l.label}</a>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`} data-testid="footer-contact" className="font-semibold text-[var(--tx2)] transition-colors hover:text-[var(--cyan)]">Contact</a>
        </div>
        <p className="font-mono2 mt-2 text-xs text-[var(--tx3)]">© 2026 AI DOCTOR · AIDOCTOR.STUDY</p>
      </div>
    </footer>
  );
}
