import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "./primitives";
import { FAQS } from "./content";

export default function Faq() {
  return (
    <section id="faq" className="relative px-5 py-28 sm:px-8" data-testid="faq-section">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <div className="font-mono2 text-xs font-bold uppercase tracking-[0.25em] text-[var(--cyan)]">FAQ</div>
          <h2 className="font-h mt-4 text-3xl font-extrabold tracking-tighter sm:text-5xl">Questions?</h2>
          <p className="mt-4 text-[var(--tx2)]">Everything you need to know.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i} value={`item-${i}`} data-testid={`faq-item-${i}`}
                className="border-b border-[var(--bd)]"
              >
                <AccordionTrigger className="py-5 text-left font-h text-base font-bold tracking-tight text-[var(--tx)] hover:text-[var(--cyan)] hover:no-underline sm:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-[var(--tx2)]">
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
