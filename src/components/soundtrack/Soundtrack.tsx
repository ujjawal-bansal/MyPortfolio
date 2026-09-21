import { waveform } from "@/content/beyondCode";
import { MAX_TRACKS, soundtrack } from "@/content/soundtrack";
import { recentTracks } from "@/lib/spotify";
import { BARS_PER_TRACK_WIDE, traceFor } from "@/lib/trace";
import { Trace, type TraceTrack } from "./Trace";

/**
 * The listening trace: fetches, shapes, and hands the result to the strip.
 *
 * A server component, so the Spotify call happens where the credentials are and the
 * markup arrives already containing the three tracks. There is no client request, no
 * loading state and no polling — the page this sits on is ISR, so one call per
 * revalidation window serves every visitor from the edge. See `lib/spotify.ts`.
 *
 * The waveform shapes are computed here rather than in the browser. They are derived from
 * the track ids, so they would come out identical either way, but computing them on the
 * server means the strip is fully drawn in the first HTML and there is nothing for
 * hydration to disagree with.
 */
export async function Soundtrack() {
  const tracks = await recentTracks();

  /*
    All three or none. Fewer than three is close to impossible — fifty plays are requested
    and collapsed — and it only happens on an account with almost no history. Rendering a
    two-thirds-wide strip for that case would mean a layout that exists to be seen once,
    and a section whose own sentence says "three" while showing two. The drawing is the
    better answer.
  */
  const complete = tracks !== null && tracks.length === MAX_TRACKS;

  return (
    <div className="mt-16 border-t border-line/50 pt-8">
      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{soundtrack.label}</p>

      {complete ? (
        <>
          <p className="mt-3 leading-relaxed text-fg measure">{soundtrack.line}</p>
          <div className="mt-8">
            <Trace tracks={tracks.map(toTraceTrack)} />
          </div>
        </>
      ) : (
        <Quiet />
      )}
    </div>
  );
}

function toTraceTrack(track: {
  id: string;
  title: string;
  artists: string;
  art: string | null;
  url: string;
}): TraceTrack {
  return { ...track, shape: traceFor(track.id), wideShape: traceFor(track.id, BARS_PER_TRACK_WIDE) };
}

/**
 * What the section was before Spotify, and what it goes back to whenever Spotify has
 * nothing to say — unconfigured, unreachable, rate limited, or a genuinely quiet week.
 *
 * Deliberately the original hand-drawn waveform rather than a skeleton or an error: the
 * drawing was never claiming to be data, so it cannot be wrong. Nothing about this state
 * looks broken, which is the point — a portfolio should not visibly depend on a third
 * party being up.
 */
function Quiet() {
  return (
    <>
      <p className="mt-3 leading-relaxed text-fg measure">{soundtrack.quiet}</p>
      <Drawing bars={waveform} className="lg:hidden" />
      {/*
        On a laptop's row, the drawing and then its reflection. Its forty-two heights are
        hand-set, so there is nothing to generate more of — and forty-two bars stretched
        across 1136px are 11px slabs. Mirrored, it keeps the original spacing across the
        full width and still says nothing it cannot stand behind.
      */}
      <Drawing bars={[...waveform, ...[...waveform].reverse()]} className="hidden lg:block" />
    </>
  );
}

function Drawing({ bars, className }: { bars: readonly number[]; className: string }) {
  return (
    <svg
      viewBox={`0 0 ${bars.length * 6} 60`}
      className={`mt-8 h-16 w-full md:h-20 ${className}`}
      role="img"
      aria-label={soundtrack.drawnLabel}
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
}
