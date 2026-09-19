import { Section } from "@/components/ui/Section";
import { answer, pairings } from "@/content/philosophyEngineering";
import { sectionById } from "@/content/sections";

export function PhilosophyEngineering() {
  const meta = sectionById("philosophy-engineering");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <p className="mt-6 text-lg text-balance text-fg-muted measure">{answer}</p>

      <ul className="mt-14 space-y-10">
        {pairings.map((pairing) => (
          <li key={pairing.id} className="border-t border-line/60 pt-6">
            <h3 className="font-mono text-xs tracking-[0.2em] text-fg-faint uppercase">{pairing.title}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-10">
              <p className="font-serif text-xl text-balance text-fg italic">{pairing.philosophy}</p>
              <p className="font-serif text-xl text-balance text-fg">{pairing.engineering}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
