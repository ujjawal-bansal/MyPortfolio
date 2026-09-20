import { Section } from "@/components/ui/Section";
import { pursuits, recording, waveform } from "@/content/beyondCode";
import { sectionById } from "@/content/sections";
import { isPending } from "@/content/types";

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

          <Waveform />
        </div>
      </div>
    </Section>
  );
}

/**
 * A drawing of a waveform, not a player.
 *
 * facts.md records no recording, so there is nothing to play. The caption that used to
 * say so is gone; nothing here is clickable, so the drawing claims nothing. If a recording
 * ever lands in `recording.href`, this becomes a link instead.
 */
function Waveform() {
  const hasRecording = !isPending(recording.href);
  const bars = waveform;

  const svg = (
    <svg
      viewBox={`0 0 ${bars.length * 6} 60`}
      className="h-16 w-full md:h-20"
      role="img"
      aria-label="A drawn waveform"
      preserveAspectRatio="none"
    >
      {bars.map((height, index) => (
        <rect
          key={index}
          x={index * 6}
          y={30 - (height * 56) / 2}
          width={2.5}
          height={height * 56}
          rx={1.25}
          className="fill-accent-dim"
          style={{ opacity: 0.35 + height * 0.5 }}
        />
      ))}
    </svg>
  );

  return (
    <div className="mt-16 border-t border-line/50 pt-8">
      {hasRecording && !isPending(recording.href) ? (
        <a href={recording.href} className="group block">
          {svg}
        </a>
      ) : (
        svg
      )}
    </div>
  );
}
