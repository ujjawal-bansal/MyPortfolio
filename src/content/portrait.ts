/**
 * The portrait in "Who am I?", and the few words it carries.
 *
 * It sits beside the answer to a list the visitor has just watched being struck out — a
 * name, a body, a collection of memories — so it does not need to say what it is. It is a
 * statue rather than a photograph of anyone: a body made to outlast the person, which is
 * the list's point made in marble — even the most durable picture of a self is still only
 * a body, and still only the observed.
 *
 * The ring around it reads like the engraving on the rim of a lens: the witness written on
 * the instrument you look through, the observed on what is inside it. It deliberately does
 * **not** say "not this, not this". The list above performs neti neti without naming it,
 * and spelling it out beside the list would explain the one thing that section leaves
 * unexplained.
 */
export const portrait = {
  /** Describes the image, not the treatment: what a sighted visitor sees in it. */
  alt: "A marble statue of a bearded man, looking up into a shaft of light",
  /**
   * The ring, one pass. Repeated round the circle by the component. साक्षी is verified in
   * docs/SOURCES.md (the hero's background): sākṣī, the witness.
   */
  ring: {
    witness: "साक्षी",
    observed: "the observed",
  },
} as const;
