import { Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { stack, stackIntro } from "@/content/stack";

export function Stack() {
  const meta = sectionById("stack");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <p className="mt-6 text-lg text-balance text-fg-muted measure">{stackIntro}</p>

      <ul className="mt-14 space-y-10">
        {stack.map((group) => (
          <li
            key={group.id}
            className="grid gap-3 border-t border-line/60 pt-5 md:grid-cols-[12rem_1fr] md:gap-8"
          >
            <div>
              <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{group.label}</h3>
              <p className="mt-2 text-sm text-balance text-fg-faint">{group.line}</p>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 self-start">
              {group.items.map((item) => (
                <li key={item.name} className="text-fg">
                  {item.name}
                  {item.note ? <span className="ml-2 text-xs text-fg-faint">{item.note}</span> : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
