/**
 * The recent past, in sound.
 *
 * Copy for the listening trace at the foot of "When I'm not writing code". Everything the
 * section says is here; the components only arrange it.
 */

/**
 * Exactly three, and the UI shows exactly three.
 *
 * Named rather than scattered — but not a dial. The waveform is divided into this many
 * stretches and the sentence below says "three", so raising it means rewriting both. It
 * is here so the API layer and the layout cannot disagree about the number.
 */
export const MAX_TRACKS = 3;

export const soundtrack = {
  label: "Lately",
  /**
   * One line, not a paragraph. It has to do two jobs: say what the strip is, and admit
   * that a waveform is not a song. "What is left of them here is a shape" is the whole
   * philosophical argument of the section, and it gets one clause.
   */
  line: "Three things that recently passed through the headphones. What is left of them here is a shape.",
  /** Shown when Spotify has nothing to say, or cannot be reached. The drawing stays. */
  quiet: "The headphones have been quiet.",
  /** Accessible name for the strip. The visual is one image; this describes it as one. */
  waveLabel: "A waveform in three stretches, one for each recent track",
  /** The original hand-drawn waveform, which is still what renders when there is no history. */
  drawnLabel: "A drawn waveform",
  /** Accessible name on each track's control; its pressed state says whether it is playing. */
  play: "Play",
  /** Beside the number of the track the player holds. Lowercase: a state, not a heading. */
  playing: "playing",
  waiting: "starting",
  paused: "paused",
  /**
   * Above Spotify's own player, when a track would not start from the waveform — the
   * browser wanted the press made there, or Spotify will not stream this one signed out.
   * Says what to do, not whose fault it is.
   */
  stalled: "This one would not start from the waveform. Spotify's own player:",
  /** Accessible name of the line above the track being played, which is also its scrubber. */
  seek: "Position in",
  /** What a screen reader hears as the playhead moves. Never drawn: the line has no numbers. */
  seekValue: (at: string, total: string) => `${at} of ${total}`,
  open: "Open in Spotify",
  /** Attribution. Spotify's terms require the source to be named where its data appears. */
  source: "Recently played · Spotify",
} as const;
