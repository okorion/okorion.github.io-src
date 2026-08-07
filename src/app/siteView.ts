export type SiteView = "portfolio" | "3d";

// Change this single value to restore the original 3D hub as the root view.
export const DEFAULT_SITE_VIEW: SiteView = "portfolio";

export function resolveSiteView(search = window.location.search): SiteView {
  const requestedView = new URLSearchParams(search).get("view");

  return requestedView === "3d" ? "3d" : DEFAULT_SITE_VIEW;
}
