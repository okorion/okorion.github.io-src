import { HubSurface } from "./navigationHub/HubSurface";
import { HubToggle } from "./navigationHub/HubToggle";
import { useNavigationHubDismissal } from "./navigationHub/useNavigationHubDismissal";
import { useNavigationHubState } from "./navigationHub/useNavigationHubState";

const stopPanelEvent = (event: { stopPropagation: () => void }) => {
  event.stopPropagation();
};

export default function Panel() {
  const {
    closeButtonRef,
    closePanel,
    closePanelWithoutFocus,
    isDesktop,
    isExpanded,
    openPanel,
    panelId,
    panelRef,
    toggleRef,
  } = useNavigationHubState();

  useNavigationHubDismissal({
    closePanel,
    closePanelWithoutFocus,
    isDesktop,
    isExpanded,
    panelRef,
  });

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
      onDragStart={(event) => event.preventDefault()}
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
}
