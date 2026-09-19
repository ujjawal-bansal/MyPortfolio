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
import { DotSceneLazy } from "@/components/three/DotSceneLazy";
import { mainContentId } from "@/content/sections";

export default function Home() {
  return (
    <>
      {/*
        The Dot lives here, not in the layout. It is the home page's argument — thought
        becoming a system and returning to a point — and repeating it behind every case
        study would turn a premise into wallpaper.
      */}
      <DotSceneLazy />
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
