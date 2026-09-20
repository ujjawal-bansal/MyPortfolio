export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "ub-theme";
export const DEFAULT_THEME: Theme = "dark";

/**
 * Applied on `<html>` before first paint by the inline script in layout.tsx, and again
 * by the toggle. Kept here so the script and the component cannot drift apart on the
 * attribute name or the storage key.
 */
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

/**
 * The blocking script. It runs before the body paints, so a returning visitor who chose
 * light never sees a frame of dark — the flash you cannot fix afterwards, because by the
 * time React hydrates the wrong colours are already on screen.
 *
 * `prefers-color-scheme` is deliberately ignored: dark is the design, not a default the
 * OS gets to override. Only an explicit choice stored here switches it.
 */
export const themeScript = `
(function(){try{
  var t = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
  document.documentElement.dataset.theme = (t === "light" || t === "dark") ? t : ${JSON.stringify(DEFAULT_THEME)};
}catch(e){document.documentElement.dataset.theme = ${JSON.stringify(DEFAULT_THEME)};}})();
`.trim();
