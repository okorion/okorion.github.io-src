import { type RefObject, useEffect, useId, useRef, useState } from "react";

interface HubLink {
  label: string;
  description: string;
  href: string;
  icon: string;
}

const links: HubLink[] = [
  {
    label: "GitHub",
    description: "코드와 사이드 프로젝트의 모든 기록",
    href: "https://github.com/okorion",
    icon: "/icons/github.svg",
  },
  {
    label: "Portfolio",
    description: "대표 작업물과 경력을 한눈에",
    href: "https://okorion.notion.site/Portfolio-1d50242aaedf80988f93f5af21fe0304",
    icon: "/icons/notion.svg",
  },
  {
    label: "Velog",
    description: "개발 관련 정보와 회고",
    href: "https://velog.io/@okorion",
    icon: "/icons/velog.svg",
  },
  {
    label: "Jekyll Blog",
    description: "깊이 있는 개발 학습 자료",
    href: "https://okorion.github.io/tech-blog/",
    icon: "/icons/jekyll.svg",
  },
];

const DESKTOP_QUERY = "(min-width: 721px) and (min-height: 681px)";

const useDesktopViewport = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia(DESKTOP_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isDesktop;
};

const HubLinkCard = ({ label, description, href, icon }: HubLink) => (
  <a
    className="nav-hub__link"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${label} 새 탭에서 열기`}
  >
    <span className="nav-hub__icon" aria-hidden="true">
      <img src={icon} alt="" width="22" height="22" />
    </span>
    <span className="nav-hub__link-copy">
      <strong>{label}</strong>
      <span>{description}</span>
    </span>
    <svg
      className="nav-hub__link-arrow"
      aria-hidden="true"
      viewBox="0 0 20 20"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 14L14 6" />
      <path d="M7 6h7v7" />
    </svg>
  </a>
);

interface HubSurfaceProps {
  panelId: string;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

const HubSurface = ({ panelId, onClose, closeButtonRef }: HubSurfaceProps) => (
  <div id={panelId} className="nav-hub__surface">
    <div className="nav-hub__header">
      <div>
        <p className="eyebrow">Explore okorion</p>
        <h1 className="nav-hub__title">원하는 곳으로 바로 이동하세요.</h1>
      </div>
      <button
        ref={closeButtonRef}
        type="button"
        className="nav-hub__close"
        onClick={onClose}
        aria-label="바로가기 메뉴 접기"
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

    <p className="nav-hub__intro">
      프로젝트와 기록을 살펴보거나, 장면을 움직이며 공간을 둘러보세요.
    </p>

    <nav className="nav-hub__links" aria-label="외부 링크">
      {links.map((link) => (
        <HubLinkCard key={link.href} {...link} />
      ))}
    </nav>

    <div className="nav-hub__meta" role="group" aria-label="3D 장면 조작 안내">
      <span>드래그로 회전</span>
      <span>스크롤로 시점 높이 조절</span>
    </div>
  </div>
);

interface HubToggleProps {
  panelId: string;
  onOpen: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
}

const HubToggle = ({ panelId, onOpen, toggleRef }: HubToggleProps) => (
  <button
    ref={toggleRef}
    type="button"
    className="nav-hub__toggle"
    onClick={onOpen}
    aria-controls={panelId}
    aria-expanded="false"
    aria-label="바로가기 메뉴 열기"
  >
    <span className="nav-hub__toggle-mark" aria-hidden="true">
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
    <span className="nav-hub__toggle-copy">
      <span className="nav-hub__toggle-eyebrow">okorion</span>
      <span className="nav-hub__toggle-label">바로가기</span>
    </span>
    <span className="nav-hub__toggle-arrow" aria-hidden="true">
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
  const isDesktop = useDesktopViewport();
  const [isExpanded, setIsExpanded] = useState(isDesktop);
  const panelId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const pendingFocusRef = useRef<"surface" | "toggle" | null>(null);

  useEffect(() => {
    setIsExpanded(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    if (isExpanded && pendingFocusRef.current === "surface") {
      closeButtonRef.current?.focus();
      pendingFocusRef.current = null;
      return;
    }

    if (!isExpanded && pendingFocusRef.current === "toggle") {
      toggleRef.current?.focus();
      pendingFocusRef.current = null;
    }
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded || isDesktop) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (!panelRef.current?.contains(target)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        pendingFocusRef.current = "toggle";
        setIsExpanded(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDesktop, isExpanded]);

  const stopPanelEvent = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
  };

  const openPanel = () => {
    pendingFocusRef.current = "surface";
    setIsExpanded(true);
  };

  const closePanel = () => {
    pendingFocusRef.current = "toggle";
    setIsExpanded(false);
  };

  return (
    <aside
      ref={panelRef}
      className="nav-hub"
      data-expanded={isExpanded ? "true" : "false"}
      data-scene-orbit-blocker="true"
      aria-label="사이트 소개와 바로가기"
      onMouseDown={stopPanelEvent}
      onMouseMove={stopPanelEvent}
      onMouseUp={stopPanelEvent}
      onWheel={stopPanelEvent}
      onDragStart={(event) => {
        event.preventDefault();
      }}
    >
      {isExpanded ? (
        <HubSurface
          panelId={panelId}
          onClose={closePanel}
          closeButtonRef={closeButtonRef}
        />
      ) : (
        <HubToggle panelId={panelId} onOpen={openPanel} toggleRef={toggleRef} />
      )}
    </aside>
  );
};

export default Panel;
