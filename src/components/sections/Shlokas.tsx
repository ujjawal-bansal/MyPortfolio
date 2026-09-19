import { ComingInPhase, Section } from "@/components/ui/Section";
import { verses } from "@/content/philosophy";
import { sectionById } from "@/content/sections";

/**
 * Only Devanagari and transliteration at this stage — which is also roughly the
 * intended resting state. Phase 6 adds the interaction: the translation arrives late,
 * and the readings only if asked for.
 */
export function Shlokas() {
  const meta = sectionById("shlokas");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <ul className="mt-14 space-y-14">
        {verses.map((verse) => (
          <li key={verse.id}>
            <p lang="sa" className="text-3xl text-fg-strong md:text-4xl">
              {verse.devanagari}
            </p>
            <p className="mt-4 font-mono text-xs tracking-[0.2em] text-fg-faint">{verse.plain}</p>
          </li>
        ))}
      </ul>
      <ComingInPhase phase={6} note="translation, prompt and the differing readings" />
    </Section>
  );
}
