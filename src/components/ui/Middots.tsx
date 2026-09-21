import { Fragment } from "react";

/**
 * A list separated by middots that never starts a line with one.
 *
 * `items.join(" · ")` breaks wherever the line runs out, and on a phone that was often
 * just before a dot: "COMPUTER SCIENCE · SOFTWARE ENGINEERING / · PHILOSOPHY". Here each
 * item holds on to the dot after it, and the only place a line can break is the space
 * that follows — so a wrapped list ends a line on a dot and starts the next on a word.
 */
export function Middots({ items }: { items: readonly string[] }) {
  return (
    <>
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <Fragment key={`${index}-${item}`}>
            <span className="whitespace-nowrap">
              {item}
              {last ? null : " ·"}
            </span>
            {last ? null : " "}
          </Fragment>
        );
      })}
    </>
  );
}
