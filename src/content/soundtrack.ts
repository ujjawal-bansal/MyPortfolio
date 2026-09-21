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
  /** On the control that opens a track. The artist is appended by the component. */
  selectHint: "Listen to",
  open: "Open in Spotify",
  /** Attribution. Spotify's terms require the source to be named where its data appears. */
  source: "Recently played · Spotify",
  /** Title on the embedded player iframe, which needs a name for screen readers. */
  playerTitle: "Spotify player",
} as const;
