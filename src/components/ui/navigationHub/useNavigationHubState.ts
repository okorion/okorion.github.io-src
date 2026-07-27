import { useEffect, useId, useRef, useState } from "react";
import { useDesktopViewport } from "./useDesktopViewport";

export function useNavigationHubState() {
  const isDesktop = useDesktopViewport();
  const [isExpanded, setIsExpanded] = useState(isDesktop);
  const panelId = useId();
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const pendingFocusRef = useRef<"surface" | "toggle" | null>(null);

  useEffect(() => setIsExpanded(isDesktop), [isDesktop]);
  useEffect(() => {
    if (isExpanded && pendingFocusRef.current === "surface") {
      closeButtonRef.current?.focus();
      pendingFocusRef.current = null;
    } else if (!isExpanded && pendingFocusRef.current === "toggle") {
      toggleRef.current?.focus();
      pendingFocusRef.current = null;
    }
  }, [isExpanded]);

  const openPanel = () => {
    pendingFocusRef.current = "surface";
    setIsExpanded(true);
  };
  const closePanel = () => {
    pendingFocusRef.current = "toggle";
    setIsExpanded(false);
  };
  const closePanelWithoutFocus = () => setIsExpanded(false);

  return {
    closeButtonRef,
    closePanel,
    closePanelWithoutFocus,
    isDesktop,
    isExpanded,
    openPanel,
    panelId,
    panelRef,
    toggleRef,
  };
}
