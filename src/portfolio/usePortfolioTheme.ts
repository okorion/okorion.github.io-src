import { useCallback, useEffect, useState } from "react";

export type PortfolioTheme = "dark" | "light";

const STORAGE_KEY = "okorion.portfolio.theme.v1";
const THEME_COLORS: Record<PortfolioTheme, string> = {
  dark: "#080a0b",
  light: "#f4f6f2",
};

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

function readSystemTheme(): PortfolioTheme {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getInitialTheme(): PortfolioTheme {
  const bootstrappedTheme =
    document.documentElement.dataset.portfolioTheme ?? null;

  if (isPortfolioTheme(bootstrappedTheme)) {
    return bootstrappedTheme;
  }

  return readStoredTheme() ?? readSystemTheme();
}

function syncBrowserTheme(theme: PortfolioTheme) {
  const root = document.documentElement;
  root.dataset.portfolioTheme = theme;
  root.style.colorScheme = theme;
  root.style.backgroundColor = THEME_COLORS[theme];

  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

export function usePortfolioTheme() {
  const [theme, setTheme] = useState<PortfolioTheme>(getInitialTheme);

  useEffect(() => {
    syncBrowserTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (readStoredTheme()) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleSystemThemeChange = () => {
      if (!readStoredTheme()) {
        setTheme(mediaQuery.matches ? "light" : "dark");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

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
