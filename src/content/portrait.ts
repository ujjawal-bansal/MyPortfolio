/**
 * The portrait in "Who am I?", and the few words it carries.
 *
 * It sits beside the answer to a list the visitor has just watched being struck out — a
 * name, a body, a collection of memories — so it does not need to say what it is. A
 * photograph is the plainest possible picture of "a body".
 *
 * The ring around it reads like the engraving on the rim of a lens: the witness written on
 * the instrument you look through, the observed on what is inside it. It deliberately does
 * **not** say "not this, not this". The list above performs neti neti without naming it,
 * and spelling it out beside the list would explain the one thing that section leaves
 * unexplained.
 */
export const portrait = {
  /** Describes the photograph, not the treatment: what a sighted visitor sees in it. */
  alt: "Ujjawal Bansal: curly hair, glasses, a dark jacket over a striped shirt",
  /**
   * The ring, one pass. Repeated round the circle by the component. साक्षी is verified in
   * docs/SOURCES.md (the hero's background): sākṣī, the witness.
   */
  ring: {
    witness: "साक्षी",
    observed: "the observed",
  },
} as const;
