import { Section } from "@/components/ui/Section";
import { notes, pursuits, recording, waveform } from "@/content/beyondCode";
import { sectionById } from "@/content/sections";
import { isPending } from "@/content/types";
import { Library } from "./Library";

/**
 * The section where the site stops making a case. Reading, thinking, singing, listening.
 * The reading archive (BRIEF §24) lives inside it, because a bookshelf is not a separate
 * argument — it is part of the same answer.
 */
export function BeyondCode() {
  const meta = sectionById("beyond-code");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <div className="mt-12 grid gap-16 md:mt-16 lg:grid-cols-[1fr_20rem] lg:gap-20">
        <div>
          <dl className="space-y-10">
            {pursuits.map((pursuit) => (
              <div key={pursuit.id} className="border-t border-line/50 pt-5">
                <dt className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{pursuit.label}</dt>
                <dd className="mt-3 leading-relaxed text-fg measure">{pursuit.body}</dd>
              </div>
            ))}
          </dl>

          <Waveform />
        </div>

        {/* Notes, pinned like paper. */}
        <aside aria-label="Notes to myself" className="space-y-7 lg:pt-4">
          {notes.map((note) => (
            <p
              key={note.text}
              className="font-hand text-2xl leading-snug text-parchment-dim/80"
              style={{ transform: `rotate(${note.rotate}deg)` }}
            >
              {note.text}
            </p>
          ))}
        </aside>
      </div>

      <Library />
    </Section>
  );
}

/**
 * A drawing of a waveform, not a player.
 *
 * facts.md records no recording, so there is nothing to play — and a waveform that looks
 * playable but is not would be a small lie told in UI. The caption says so outright. If a
 * recording ever lands in `recording.href`, this becomes a link instead.
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
    <figure className="mt-16 border-t border-line/50 pt-8">
      {hasRecording && !isPending(recording.href) ? (
        <a href={recording.href} className="group block">
          {svg}
        </a>
      ) : (
        svg
      )}
      <figcaption className="mt-4 font-mono text-[0.6875rem] text-fg-ghost">{recording.label}</figcaption>
    </figure>
  );
}
