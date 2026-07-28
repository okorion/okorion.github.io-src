import type { RefObject } from "react";
import { HubLinkCard } from "./HubLinkCard";
import { CloseIcon } from "./NavigationHubIcons";
import { navigationLinks } from "./navigationLinks";

interface HubSurfaceProps {
  panelId: string;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

export function HubSurface({
  panelId,
  onClose,
  closeButtonRef,
}: HubSurfaceProps) {
  return (
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
          <CloseIcon />
        </button>
      </div>
      <p className="nav-hub__intro">
        프로젝트와 기록을 살펴보거나, 장면을 움직이며 공간을 둘러보세요.
      </p>
      <nav className="nav-hub__links" aria-label="외부 링크">
        {navigationLinks.map((link) => (
          <HubLinkCard key={link.href} {...link} />
        ))}
      </nav>
      <div
        className="nav-hub__meta"
        role="group"
        aria-label="3D 장면 조작 안내"
      >
        <span>마우스 드래그로 회전</span>
        <span>스크롤로 시점 높이·장면 회전</span>
      </div>
    </div>
  );
}
