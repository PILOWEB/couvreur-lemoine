import { useSeo } from '@/hooks/useSeo';
import { Hero } from '@/components/sections/Hero';
import { Urgence } from '@/components/sections/Urgence';
import { Marquee } from '@/components/sections/Marquee';
import { Metier } from '@/components/sections/Metier';
import { Services } from '@/components/sections/Services';
import { Materiaux } from '@/components/sections/Materiaux';
import { Realisations } from '@/components/sections/Realisations';
import { Methode } from '@/components/sections/Methode';
import { Chiffres } from '@/components/sections/Chiffres';
import { Temoignages } from '@/components/sections/Temoignages';
import { Zone } from '@/components/sections/Zone';
import { Devis } from '@/components/sections/Devis';
import { Faq } from '@/components/sections/Faq';

export function Home() {
  useSeo();
  return (
    <>
      <Hero />
      <Urgence />
      <Marquee />
      <Metier />
      <Services />
      <Materiaux />
      <Realisations />
      <Methode />
      <Chiffres />
      <Temoignages />
      <Zone />
      <Devis />
      <Faq />
    </>
  );
}
