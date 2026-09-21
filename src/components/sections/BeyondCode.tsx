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
        Full width, like the sections above it. It used to be one column capped at 768px,
        which left a third of the row empty on a laptop and cut every rule short of the
        others on the page.

        The pursuits pair off rather than stretch: reading beside what it leads to, singing
        beside listening. Two columns is what keeps each paragraph at a readable measure
        while the row still uses the width — the same answer the projects and "How I think"
        already give. Listening lands directly above the trace, which is where it belongs.
      */}
      <dl className="mt-8 grid grid-cols-1 gap-x-12 gap-y-7 md:mt-10 lg:grid-cols-2">
        {pursuits.map((pursuit) => (
          <div key={pursuit.id} className="border-t border-line/50 pt-5">
            <dt className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{pursuit.label}</dt>
            <dd className="mt-3 leading-relaxed text-fg measure">{pursuit.body}</dd>
          </div>
        ))}
      </dl>

      <Soundtrack />
    </Section>
  );
}
