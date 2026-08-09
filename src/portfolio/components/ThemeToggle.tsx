interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.25v2M12 19.75v2M4.25 12h-2M21.75 12h-2M5.1 5.1 3.7 3.7M20.3 20.3l-1.4-1.4M18.9 5.1l1.4-1.4M3.7 20.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.1 15.45A8.25 8.25 0 0 1 8.55 3.9 8.25 8.25 0 1 0 20.1 15.45Z" />
    </svg>
  );
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  const label = isDark ? "밝은 테마로 전환" : "어두운 테마로 전환";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={label}
      title={label}
      onClick={onToggle}
    >
      <span className="theme-toggle__icon">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
      <span className="theme-toggle__label">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
