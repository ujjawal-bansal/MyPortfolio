import { ComingInPhase, Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { site } from "@/content/site";

export function Self() {
  const meta = sectionById("self");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <div className="mt-8 space-y-4 text-lg text-fg-muted measure">
        <p>
          {site.education.degree} at {site.education.institution}, graduating {site.education.graduates}.
        </p>
      </div>
      <ComingInPhase phase={4} note="the rest of this section" />
    </Section>
  );
}
