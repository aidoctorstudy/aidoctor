import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./primitives";
import { FAQS } from "./content";

export default function Faq() {
  return (
    <section id="faq" className="relative bg-[var(--surface2)] px-5 py-24 sm:px-8" data-testid="faq-section">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--p2)]">FAQ</div>
          <h2 className="font-h mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Questions?</h2>
          <p className="mt-4 text-[var(--tx2)]">Everything you need to know.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i} value={`item-${i}`} data-testid={`faq-item-${i}`}
                className="glass overflow-hidden rounded-2xl border-none px-5"
              >
                <AccordionTrigger className="py-4 text-left font-h text-base font-semibold text-[var(--tx)] hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-[var(--tx2)]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
