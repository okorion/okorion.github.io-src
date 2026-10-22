export type SiteView = "portfolio" | "projects" | "about" | "3d";

export const DEFAULT_SITE_VIEW: SiteView = "portfolio";

export function resolveSiteView(search = window.location.search): SiteView {
  const requestedView = new URLSearchParams(search).get("view");

  return requestedView === "3d" ||
    requestedView === "projects" ||
    requestedView === "about"
    ? requestedView
    : DEFAULT_SITE_VIEW;
}
