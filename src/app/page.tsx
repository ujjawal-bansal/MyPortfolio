import {
  BeyondCode,
  Contact,
  Footer,
  Hero,
  HowIThink,
  Journey,
  PhilosophyEngineering,
  Projects,
  Self,
  Shlokas,
  Stack,
} from "@/components/sections";
import { mainContentId } from "@/content/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <main id={mainContentId} data-neti-layer="words" className="relative z-10 flex-1">
        <Self />
        <HowIThink />
        <PhilosophyEngineering />
        <Projects />
        <Shlokas />
        <BeyondCode />
        <Journey />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
