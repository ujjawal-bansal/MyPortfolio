import { booksByCategory, categories, libraryIsPlaceholder } from "@/content/library";
import { isPending } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The reading archive: books as spines standing on a shelf, grouped by tradition.
 *
 * **Every book here is a placeholder.** facts.md records the reading list as unfilled and
 * the brief is explicit about not fabricating books Ujjawal has read, so the spines are
 * drawn blank and labelled as empty slots. The architecture is real; the contents are
 * openly missing, which is the only honest way to ship this section early.
 */
export function Library() {
  return (
    <section aria-labelledby="library-heading" className="mt-24 md:mt-32">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 id="library-heading" className="font-serif text-2xl text-fg-strong md:text-3xl">
          The shelf
        </h3>
        {libraryIsPlaceholder ? (
          <p className="rounded-full border border-line px-3 py-1 font-mono text-[0.625rem] tracking-[0.15em] text-fg-ghost uppercase">
            Empty — Ujjawal has not filled this in
          </p>
        ) : null}
      </div>

      <div className="mt-12 space-y-14">
        {categories.map((category) => {
          const books = booksByCategory(category.id);

          return (
            <div key={category.id}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h4 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{category.label}</h4>
                <p className="text-sm text-fg-faint">{category.line}</p>
              </div>

              {/* The shelf: spines stand on a rule. */}
              <div className="mt-5">
                <ul className="flex flex-wrap items-end gap-2.5">
                  {books.map((book, index) => {
                    const empty = isPending(book.title);
                    // Varied heights so a shelf reads as a shelf and not as a chart.
                    const height = 96 + ((index * 37) % 4) * 14;

                    return (
                      <li key={book.id}>
                        <div
                          style={{ height }}
                          className={cn(
                            "flex w-11 items-end justify-center rounded-t-sm border border-b-0 pb-3",
                            empty ? "border-dashed border-line-strong/70" : "border-line bg-bg-raised",
                          )}
                        >
                          <span
                            className={cn(
                              "font-mono text-[0.625rem] tracking-wide",
                              empty ? "text-fg-ghost" : "text-fg-muted",
                            )}
                            style={{ writingMode: "vertical-rl", rotate: "180deg" }}
                          >
                            {empty ? "empty" : book.title}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="h-px w-full bg-line-strong/60" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
