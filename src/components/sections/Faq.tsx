import { useId, useState } from 'react';
import { FAQ } from '@/data/content';
import { SplitTitle } from '@/components/ui/SplitTitle';
import { Reveal } from '@/components/ui/Reveal';

/* Accordéon accessible : boutons réels, aria-expanded, hauteur animée via grid. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="section container-fluid">
      <div className="grid-12 gap-y-10">
        <div className="col-span-12 lg:col-span-4">
          <p className="eyebrow mb-8">Questions fréquentes</p>
          <SplitTitle id="faq-title" lines={['Ce qu’on', 'me demande', 'au téléphone.']} accent="téléphone." className="text-2xl md:text-3xl" />
        </div>
        <dl className="rule-strong col-span-12 lg:col-span-7 lg:col-start-6">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            const id = `${base}-${i}`;
            return (
              <Reveal key={f.q} variant="lift" delay={i * 0.04}>
                <div className="border-b border-line">
                  <dt>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${id}-panel`}
                      id={`${id}-btn`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-baseline justify-between gap-6 py-6 text-left"
                    >
                      <span className="font-display text-lg md:text-xl">{f.q}</span>
                      <span aria-hidden className={`num shrink-0 text-lg transition-transform duration-500 ease-[var(--ease-out)] ${isOpen ? 'rotate-45' : ''}`}>+</span>
                    </button>
                  </dt>
                  <dd
                    id={`${id}-panel`}
                    role="region"
                    aria-labelledby={`${id}-btn`}
                    className={`grid transition-[grid-template-rows] duration-600 ease-[var(--ease-in-out)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="para max-w-[60ch] pb-6 !text-base">{f.r}</p>
                    </div>
                  </dd>
                </div>
              </Reveal>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
