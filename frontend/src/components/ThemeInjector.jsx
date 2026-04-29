import React, { useMemo } from "react";
import { useContent } from "../context/ContentContext";

// Escape for CSS class selectors: Tailwind compiles "bg-[#1a5336]" to selector ".bg-\[\#1a5336\]"
// so we need to escape [ ] and # in the CSS selector
const esc = (hex) => {
  const s = hex.replace("#", "\\#");
  return s;
};
const cls = (prefix, hex) => `.${prefix}-\\[${esc(hex)}\\]`;

export const ThemeInjector = () => {
  const { content } = useContent();
  const theme = content?.theme || {
    primary: "#0a0a0a",
    primaryDark: "#1f1f1f",
    accent: "#F5C518",
    accentDark: "#d4a810",
    bgDark: "#0a0a0a",
    bgLight: "#fafafa",
    bgCream: "#1a1a1a",
  };

  const css = useMemo(() => {
    const rules = [];
    rules.push(`:root{
      --color-primary:${theme.primary};
      --color-primary-dark:${theme.primaryDark};
      --color-accent:${theme.accent};
      --color-accent-dark:${theme.accentDark};
      --color-bg-dark:${theme.bgDark};
      --color-bg-light:${theme.bgLight};
      --color-bg-cream:${theme.bgCream};
    }`);

    const mapColor = (oldHexList, cssVar, cssVarDark) => {
      for (const hex of oldHexList) {
        rules.push(`
          ${cls("bg", hex)}{background-color:${cssVar}!important;}
          ${cls("text", hex)}{color:${cssVar}!important;}
          ${cls("border", hex)}{border-color:${cssVar}!important;}
          ${cls("fill", hex)}{fill:${cssVar}!important;}
          ${cls("from", hex)}{--tw-gradient-from:${cssVar} var(--tw-gradient-from-position)!important;--tw-gradient-to:transparent var(--tw-gradient-to-position)!important;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)!important;}
          ${cls("to", hex)}{--tw-gradient-to:${cssVar} var(--tw-gradient-to-position)!important;}
          ${cls("via", hex)}{--tw-gradient-stops:var(--tw-gradient-from),${cssVar} var(--tw-gradient-via-position),var(--tw-gradient-to)!important;}
          .hover\\:${cls("bg", hex).slice(1)}:hover{background-color:${cssVarDark}!important;}
          .hover\\:${cls("text", hex).slice(1)}:hover{color:${cssVarDark}!important;}
          .hover\\:${cls("border", hex).slice(1)}:hover{border-color:${cssVarDark}!important;}
          .group:hover .group-hover\\:${cls("bg", hex).slice(1)}{background-color:${cssVarDark}!important;}
          .group:hover .group-hover\\:${cls("text", hex).slice(1)}{color:${cssVarDark}!important;}
        `);
      }
    };

    // Old greens -> new primary
    mapColor(
      ["#1a5336", "#143f28", "#0f1f18", "#0c1813", "#14432c"],
      "var(--color-primary)",
      "var(--color-primary-dark)"
    );
    // Old golds -> new accent
    mapColor(
      ["#c9a961", "#b99747"],
      "var(--color-accent)",
      "var(--color-accent-dark)"
    );

    // Cream bg (kept neutral warm)
    const cream = "#fbf8f1";
    rules.push(`
      ${cls("bg", cream)}{background-color:#faf7ed!important;}
      ${cls("from", cream)}{--tw-gradient-from:#faf7ed var(--tw-gradient-from-position)!important;}
      ${cls("via", cream)}{--tw-gradient-stops:var(--tw-gradient-from),#faf7ed var(--tw-gradient-via-position),var(--tw-gradient-to)!important;}
      ${cls("to", cream)}{--tw-gradient-to:#faf7ed var(--tw-gradient-to-position)!important;}
    `);

    return rules.join("\n");
  }, [theme]);

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};
