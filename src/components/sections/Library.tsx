import { booksByCategory, categories, shelfIsEmpty, shelfNote } from "@/content/library";
import { isPending } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The reading archive (BRIEF §24).
 *
 * Nothing is invented here — facts.md records the reading list as unfilled and the brief
 * forbids fabricating books — so the shelves themselves carry the meaning. What each one
 * is for is true today and stays true once books land on it.
 *
 * The shelves run side by side and wrap, rather than stacking. Stacked full-width rules
 * read as a table, which is what this section is least; side by side they read as what
 * they are, and a last row that does not fill is what a real bookcase looks like anyway.
 *
 * Adding a `Book` to library.ts makes a spine stand up on its shelf. Nothing here needs
 * to change for that, and `shelfNote` should be deleted the day it stops being true.
 */
export function Library() {
  return (
    <section aria-labelledby="library-heading" className="mt-24 md:mt-32">
      <h3 id="library-heading" className="font-serif text-2xl text-fg-strong md:text-3xl">
        The shelf
      </h3>

      {/* States the absence outright, the way the waveform's caption does. */}
      {shelfIsEmpty ? <p className="mt-4 text-fg-faint measure">{shelfNote}</p> : null}

      <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-8 lg:grid-cols-3">
        {categories.map((category) => {
          const shelved = booksByCategory(category.id);

          return (
            // `flex flex-col` with `mt-auto` on the shelf below: shelves in a row must
            // be level. A two-line description would otherwise push its own shelf lower
            // than its neighbours', which reads as a mistake rather than a bookcase.
            <li key={category.id} className="flex flex-col">
              <h4 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{category.label}</h4>
              <p className="mt-2 text-sm text-fg-faint">{category.line}</p>

              {/*
                Where the spines stand. Empty, it is open space above the shelf — the
                emptiness made visible on purpose, rather than drawn as broken slots.
                A spacer rather than an empty <ul>, which would announce "list, 0 items".
              */}
              <div className="mt-auto">
                {shelved.length === 0 ? (
                  <div aria-hidden className="h-14" />
                ) : (
                  <ul
                    // No wrapping. A column this narrow fits about three spines, and a
                    // wrapped second row would float with no shelf under it. They scroll
                    // sideways instead, so every spine stands on the one shelf.
                    className="mt-6 flex items-end gap-2 overflow-x-auto pb-px"
                  >
                    {shelved.map((book, index) => {
                      const untitled = isPending(book.title);
                      // Varied heights so a shelf reads as a shelf and not as a chart.
                      const height = 88 + ((index * 37) % 4) * 12;

                      return (
                        <li key={book.id}>
                          <div
                            style={{ height }}
                            className={cn(
                              "flex w-10 items-end justify-center rounded-t-sm border border-b-0 pb-3",
                              untitled ? "border-dashed border-line-strong/70" : "border-line bg-bg-raised",
                            )}
                          >
                            <span
                              className={cn(
                                "font-mono text-[0.625rem] tracking-wide",
                                untitled ? "text-fg-ghost" : "text-fg-muted",
                              )}
                              style={{ writingMode: "vertical-rl", rotate: "180deg" }}
                            >
                              {untitled ? "untitled" : book.title}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* The shelf this category's spines stand on. */}
                <div className="h-px w-full bg-line-strong/50" />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
