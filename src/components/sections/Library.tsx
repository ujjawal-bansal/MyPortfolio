import { booksByCategory, categories, shelfIsEmpty, shelfNote } from "@/content/library";
import { isPending } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The reading archive (BRIEF §24), as a bookcase.
 *
 * It used to be fifteen dashed rectangles labelled "empty", which made a finished section
 * look broken. Nothing is invented to replace them — facts.md records the reading list as
 * unfilled and the brief forbids fabricating books — so the shelves themselves carry the
 * meaning. What each one is for is true today and stays true once books land on it.
 *
 * The two side rails are the whole trick: five horizontal rules on their own read as a
 * table, which is what this section is least. Bound at both ends they read as a case, and
 * an empty case is a thing that looks deliberate rather than unfinished.
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

      <div className="mt-10 max-w-2xl divide-y divide-line-strong/40 rounded-sm border border-line-strong/40">
        {categories.map((category) => {
          const shelved = booksByCategory(category.id);

          return (
            <div key={category.id} className="px-5 pt-5 sm:px-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h4 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{category.label}</h4>
                <p className="text-sm text-fg-faint">{category.line}</p>
              </div>

              {/*
                Where the spines stand. Empty, it is open space above the shelf — the
                emptiness made visible on purpose, rather than drawn as broken slots.
                A spacer rather than an empty <ul>, which would announce "list, 0 items".
              */}
              {shelved.length === 0 ? (
                <div aria-hidden className="h-12" />
              ) : (
                <ul className="mt-5 flex flex-wrap items-end gap-2.5">
                  {shelved.map((book, index) => {
                    const untitled = isPending(book.title);
                    // Varied heights so a shelf reads as a shelf and not as a chart.
                    const height = 96 + ((index * 37) % 4) * 14;

                    return (
                      <li key={book.id}>
                        <div
                          style={{ height }}
                          className={cn(
                            "flex w-11 items-end justify-center rounded-t-sm border border-b-0 pb-3",
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
