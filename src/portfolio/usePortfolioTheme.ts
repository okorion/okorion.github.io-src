import { useCallback, useEffect, useState } from "react";

export type PortfolioTheme = "dark" | "light";

const STORAGE_KEY = "okorion.portfolio.theme.v1";
const DARK_THEME_COLOR = "#080a0b";
const LIGHT_THEME_COLOR = "#ffffff";

function isPortfolioTheme(value: string | null): value is PortfolioTheme {
  return value === "dark" || value === "light";
}

function readStoredTheme(): PortfolioTheme | null {
  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    return isPortfolioTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

function getThemeColor(theme: PortfolioTheme) {
  return theme === "light" ? LIGHT_THEME_COLOR : DARK_THEME_COLOR;
}

function getInitialTheme(): PortfolioTheme {
  const bootstrappedTheme =
    document.documentElement.dataset.portfolioTheme ?? null;

  if (isPortfolioTheme(bootstrappedTheme)) {
    return bootstrappedTheme;
  }

  return readStoredTheme() ?? "light";
}

function syncBrowserTheme(theme: PortfolioTheme) {
  const root = document.documentElement;
  const themeColor = getThemeColor(theme);
  root.dataset.portfolioTheme = theme;
  root.style.colorScheme = theme;
  root.style.backgroundColor = themeColor;

  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", themeColor);
}

export function usePortfolioTheme() {
  const [theme, setTheme] = useState<PortfolioTheme>(getInitialTheme);

  useEffect(() => {
    syncBrowserTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still applies for this session when storage is blocked.
    }

    setTheme(nextTheme);
  }, [theme]);

  return { theme, toggleTheme };
}
