import { useEffect, useId, useRef, useState } from "react";

interface PanelLink {
  label: string;
  href: string;
}

const links: PanelLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/okorion",
  },
  {
    label: "Velog",
    href: "https://velog.io/@okorion",
  },
  {
    label: "Jekyll Blog",
    href: "https://okorion.github.io/tech-blog/",
  },
  {
    label: "Portfolio",
    href: "https://okorion.notion.site/Portfolio-1d50242aaedf80988f93f5af21fe0304",
  },
];

const BrandLink = ({ label, href }: PanelLink) => (
  <a
    className="brand-link"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {label}
  </a>
);

interface BrandPanelSurfaceProps {
  panelId: string;
  onClose: () => void;
}

const BrandPanelSurface = ({ panelId, onClose }: BrandPanelSurfaceProps) => (
  <div id={panelId} className="brand-panel__surface">
    <div className="brand-panel__header">
      <p className="eyebrow">okorion</p>
      <button
        type="button"
        className="brand-panel__close"
        onClick={onClose}
        aria-label="패널 닫기"
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
      <span className="brand-title__line">생각과 작업을 담아둔</span>
      <span className="brand-title__line">나만의 디지털 공간.</span>
    </h1>
    <p className="brand-copy">
      <span className="brand-copy__line">
        자주 쓰는 링크를 한 곳에 모았어요.
      </span>
      <span className="brand-copy__line">
        scene은 그대로, 원하는 곳으로 바로 이동하세요.
      </span>
    </p>

    <div className="brand-actions">
      {links.map((link) => (
        <BrandLink key={link.href} {...link} />
      ))}
    </div>

    <div className="brand-meta">
      <span>드래그로 회전</span>
      <span>스크롤로 시점 높이 조절</span>
    </div>
  </div>
);

interface BrandPanelToggleProps {
  panelId: string;
  onOpen: () => void;
}

const BrandPanelToggle = ({ panelId, onOpen }: BrandPanelToggleProps) => (
  <button
    type="button"
    className="brand-panel__toggle"
    onClick={onOpen}
    aria-controls={panelId}
    aria-expanded="false"
    aria-label="패널 열기"
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
      <span className="brand-panel__toggle-label">바로가기</span>
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
);

const Panel = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLElement | null>(null);

  const stopPanelEvent = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
  };

  const closePanel = () => {
    setIsExpanded(false);
  };

  const openPanel = () => {
    setIsExpanded(true);
  };

  useEffect(() => {
    if (!isExpanded) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (!panelRef.current?.contains(target)) {
        closePanel();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePanel();
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
      data-scene-orbit-blocker="true"
      aria-label="사이트 소개와 링크"
      onMouseDown={stopPanelEvent}
      onMouseMove={stopPanelEvent}
      onMouseUp={stopPanelEvent}
      onWheel={stopPanelEvent}
      onDragStart={(event) => {
        event.preventDefault();
      }}
    >
      {isExpanded ? (
        <BrandPanelSurface panelId={panelId} onClose={closePanel} />
      ) : (
        <BrandPanelToggle panelId={panelId} onOpen={openPanel} />
      )}
    </aside>
  );
};

export default Panel;
