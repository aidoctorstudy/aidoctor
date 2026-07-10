import { Stethoscope } from "lucide-react";
import { NAV_LINKS, CONTACT_EMAIL } from "./content";

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--bd)] px-5 py-14 sm:px-8" data-testid="footer">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 text-center">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--p)] to-[var(--p2)]">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="font-h text-xl font-bold grad-text">AI Doctor</span>
        </div>
        <p className="text-sm text-[var(--tx2)]">Study smarter. Save lives.</p>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="font-semibold text-[var(--tx2)] transition-colors hover:text-[var(--tx)]">
              {l.label}
            </a>
          ))}
          <a href={`mailto:${CONTACT_EMAIL}`} data-testid="footer-contact" className="font-semibold text-[var(--tx2)] transition-colors hover:text-[var(--tx)]">
            Contact
          </a>
        </div>
        <p className="mt-2 text-xs text-[var(--tx3)]">© 2026 AI Doctor · aidoctor.study. All rights reserved.</p>
      </div>
    </footer>
  );
}
