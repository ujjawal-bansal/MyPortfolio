import { Soundtrack } from "@/components/soundtrack/Soundtrack";
import { Section } from "@/components/ui/Section";
import { pursuits } from "@/content/beyondCode";
import { sectionById } from "@/content/sections";

/**
 * The section where the site stops making a case. Reading, thinking, singing, listening.
 */
export function BeyondCode() {
  const meta = sectionById("beyond-code");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      {/*
        One column now — the right-hand track existed only for the note fragments. Capped
        at the width that track used to leave, so the rules still end near the text rather
        than running the full 1136px over a 544px measure.
      */}
      <div className="mt-8 max-w-3xl md:mt-10">
        <div>
          <dl className="space-y-7">
            {pursuits.map((pursuit) => (
              <div key={pursuit.id} className="border-t border-line/50 pt-5">
                <dt className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{pursuit.label}</dt>
                <dd className="mt-3 leading-relaxed text-fg measure">{pursuit.body}</dd>
              </div>
            ))}
          </dl>

          <Soundtrack />
        </div>
      </div>
    </Section>
  );
}
