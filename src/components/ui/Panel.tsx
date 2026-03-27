import { useEffect, useId, useRef, useState } from "react";

const links = [
  {
    label: "GitHub",
    href: "https://github.com/okorion",
  },
  {
    label: "Tech Blog",
    href: "https://okorion.github.io/tech-blog/",
  },
  {
    label: "Portfolio",
    href: "https://okorion.notion.site/Portfolio-1d50242aaedf80988f93f5af21fe0304",
  },
];

const Panel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isExpanded) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (!panelRef.current?.contains(target)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  return (
    <aside
      ref={panelRef}
      className="brand-panel"
      data-expanded={isExpanded ? "true" : "false"}
      aria-label="Site introduction and links"
    >
      {isExpanded ? (
        <div id={panelId} className="brand-panel__surface">
          <div className="brand-panel__header">
            <p className="eyebrow">okorion</p>
            <button
              type="button"
              className="brand-panel__close"
              onClick={() => setIsExpanded(false)}
              aria-label="Collapse site panel"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              >
                <path d="M5 5L15 15" />
                <path d="M15 5L5 15" />
              </svg>
            </button>
          </div>
          <h1 className="brand-title">
            3D hub for selected projects and notes.
          </h1>
          <p className="brand-copy">
            The scene stays visible first. This layer only adds context, quick
            navigation, and a stable reading surface.
          </p>

          <div className="brand-actions">
            {links.map((link) => (
              <a
                key={link.href}
                className="brand-link"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="brand-meta">
            <span>Drag or scroll to orbit</span>
            <span>Dark canvas, light touch</span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="brand-panel__toggle"
          onClick={() => setIsExpanded(true)}
          aria-controls={panelId}
          aria-expanded="false"
          aria-label="Expand site panel"
        >
          <span className="brand-panel__toggle-mark" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3.25" />
              <path d="M12 2.75v3.1" />
              <path d="M12 18.15v3.1" />
              <path d="M2.75 12h3.1" />
              <path d="M18.15 12h3.1" />
            </svg>
          </span>
          <span className="brand-panel__toggle-copy">
            <span className="brand-panel__toggle-eyebrow">okorion</span>
            <span className="brand-panel__toggle-label">Open hub</span>
          </span>
          <span className="brand-panel__toggle-arrow" aria-hidden="true">
            <svg
              viewBox="0 0 20 20"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 7l6 6 6-6" />
            </svg>
          </span>
        </button>
      )}
    </aside>
  );
};

export default Panel;
