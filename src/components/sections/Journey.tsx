import { Section } from "@/components/ui/Section";
import { journey, journeyNote } from "@/content/journey";
import { sectionById } from "@/content/sections";
import { isPending } from "@/content/types";
import { cn } from "@/lib/utils";

export function Journey() {
  const meta = sectionById("journey");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <ol className="mt-12 space-y-px">
        {journey.map((milestone) => (
          <li
            key={milestone.id}
            className={cn(
              "grid gap-1 border-t border-line/60 py-6 md:grid-cols-[10rem_1fr] md:gap-6",
              milestone.future && "opacity-55",
            )}
          >
            <p className="font-mono text-xs tracking-[0.15em] text-fg-faint uppercase">
              {/* A date facts.md does not state is left visibly blank, never guessed. */}
              {isPending(milestone.when) ? "date tbc" : milestone.when}
            </p>
            <div>
              <h3 className="font-serif text-lg text-fg-strong">{milestone.title}</h3>
              {milestone.where ? <p className="mt-1 text-sm text-fg-muted">{milestone.where}</p> : null}
              {milestone.body ? (
                <p className="mt-2 text-sm text-balance text-fg-muted measure">{milestone.body}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm text-balance text-fg-faint measure">{journeyNote}</p>
    </Section>
  );
}
