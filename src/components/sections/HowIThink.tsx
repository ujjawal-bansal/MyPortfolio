import { Section } from "@/components/ui/Section";
import { howIThink } from "@/content/howIThink";
import { sectionById } from "@/content/sections";

export function HowIThink() {
  const meta = sectionById("how-i-think");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <ul className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {howIThink.map((habit) => (
          <li key={habit.id} className="border-t border-line/60 py-6 pr-6">
            <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{habit.verb}</h3>
            <p className="mt-3 font-serif text-lg text-balance text-fg">{habit.line}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
