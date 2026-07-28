import type { RefObject } from "react";
import { ChevronDownIcon, HubMarkIcon } from "./NavigationHubIcons";

interface HubToggleProps {
  panelId: string;
  onOpen: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
}

export function HubToggle({ panelId, onOpen, toggleRef }: HubToggleProps) {
  return (
    <button
      ref={toggleRef}
      type="button"
      className="nav-hub__toggle"
      onClick={onOpen}
      aria-controls={panelId}
      aria-expanded="false"
    >
      <span className="nav-hub__toggle-mark" aria-hidden="true">
        <HubMarkIcon />
      </span>
      <span className="nav-hub__toggle-copy">
        <span className="nav-hub__toggle-eyebrow">okorion</span>
        <span className="nav-hub__toggle-label">바로가기</span>
      </span>
      <span className="nav-hub__toggle-arrow" aria-hidden="true">
        <ChevronDownIcon />
      </span>
    </button>
  );
}
