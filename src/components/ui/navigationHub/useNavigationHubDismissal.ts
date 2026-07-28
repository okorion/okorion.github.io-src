import { type RefObject, useEffect } from "react";

interface DismissalOptions {
  closePanel: () => void;
  closePanelWithoutFocus: () => void;
  isDesktop: boolean;
  isExpanded: boolean;
  panelRef: RefObject<HTMLElement | null>;
}

export function useNavigationHubDismissal({
  closePanel,
  closePanelWithoutFocus,
  isDesktop,
  isExpanded,
  panelRef,
}: DismissalOptions) {
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePanel, isExpanded]);

  useEffect(() => {
    if (!isExpanded || isDesktop) return;
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && !panelRef.current?.contains(target)) {
        closePanelWithoutFocus();
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [closePanelWithoutFocus, isDesktop, isExpanded, panelRef]);
}
