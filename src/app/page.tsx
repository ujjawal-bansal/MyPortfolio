import {
  BeyondCode,
  Contact,
  Footer,
  Hero,
  HowIThink,
  Journey,
  Projects,
  Self,
  Stack,
} from "@/components/sections";
import { DotSceneLazy } from "@/components/three/DotSceneLazy";
import { mainContentId } from "@/content/sections";

/**
 * Regenerated every fifteen minutes, for one reason: the listening trace at the foot of
 * "When I'm not writing code" reads from Spotify, and a statically built page would show
 * whatever was playing the day it was deployed, forever.
 *
 * This is the cache the section relies on. One Spotify call per window, shared by every
 * visitor from the edge — not one per visitor, and no client-side polling to pause when
 * the tab is hidden, because there is none. Fifteen minutes is chosen against what the
 * data actually is: nobody needs to know within the minute what a stranger was listening
 * to, and ninety-six calls a day is nothing against a rate limit.
 *
 * Everything else here is still static, and the section is designed so that a Spotify
 * outage costs it a drawing rather than an error.
 */
export const revalidate = 900;

export default function Home() {
  return (
    <>
      {/*
        The Dot lives here, not in the layout. It is the home page's argument — thought
        becoming a system and returning to a point — and repeating it behind every case
        study would turn a premise into wallpaper.
      */}
      <DotSceneLazy />
      <main id={mainContentId} data-neti-layer="words" className="relative z-10 flex-1">
        {/* This order is mirrored in content/sections.ts — the nav reads from there. */}
        {/* The hero is the opening of Self, not a section of its own. */}
        <Self lead={<Hero />} />
        <Projects />
        <HowIThink />
        <Journey />
        <Stack />
        <BeyondCode />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
