/**
 * The visitor counter's wording.
 *
 * The circle only ever shows a number. This is what the tooltip and the accessible name
 * say, so the meaning is withheld from the layout rather than from the visitor.
 *
 * Note for whoever reads this later: the number is **unique visitors**, not page views.
 * A refresh does not move it. "Views" is the label Ujjawal asked for; it undersells what
 * the figure actually measures rather than overselling it, which is the safe direction.
 */
export const visitorsCopy = {
  one: "view",
  many: "views",
} as const;
