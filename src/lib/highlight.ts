import { createHighlighter, type Highlighter, type ThemeRegistration } from "shiki";
import { palette } from "./palette";

/**
 * Build-time syntax highlighting.
 *
 * Every page that uses this is statically generated, so shiki runs during `next build`
 * and the browser receives plain pre-coloured markup — no highlighter, no grammars, no
 * client JavaScript at all.
 *
 * The theme is ours rather than a borrowed one. A stock dark theme would import a
 * second palette into a site that has spent four phases establishing one; these are the
 * same tokens as globals.css, written as literals because a TextMate theme cannot read
 * CSS custom properties.
 */
const theme: ThemeRegistration = {
  name: "ujjawal-dark",
  type: "dark",
  colors: {
    // Transparent: the surrounding figure owns the background and border.
    "editor.background": "#00000000",
    "editor.foreground": palette.parchment,
  },
  settings: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: palette.parchmentFaint, fontStyle: "italic" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
      settings: { foreground: palette.amber },
    },
    {
      scope: ["string", "string.quoted", "constant.other.symbol"],
      settings: { foreground: palette.forestBright },
    },
    { scope: ["constant.numeric", "constant.language"], settings: { foreground: palette.blueBright } },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: palette.ivory },
    },
    {
      scope: ["entity.name.type", "support.type", "support.class", "entity.name.class"],
      settings: { foreground: palette.blueBright },
    },
    { scope: ["variable", "meta.definition.variable"], settings: { foreground: palette.parchment } },
    {
      scope: ["variable.parameter", "variable.other.property"],
      settings: { foreground: palette.parchmentDim },
    },
    { scope: ["punctuation", "meta.brace"], settings: { foreground: palette.parchmentFaint } },
  ],
};

export type SnippetLanguage = "ts" | "sql";

let highlighterPromise: Promise<Highlighter> | null = null;

/** One highlighter for the whole build; loading grammars per call is needlessly slow. */
function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: [theme],
    langs: ["ts", "sql"] satisfies SnippetLanguage[],
  });
  return highlighterPromise;
}

export async function highlight(code: string, lang: SnippetLanguage): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code.trim(), {
    lang,
    theme: "ujjawal-dark",
  });
}
