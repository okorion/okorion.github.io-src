import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { RouteErrorBoundary } from "./app/RouteErrorBoundary";
import { resolveSiteView } from "./app/siteView";
import { PortfolioPage } from "./portfolio/PortfolioPage";
import { getPageMetadata } from "./portfolio/portfolioContent";

const LegacyThreeHubPage = lazy(() => import("./legacy/LegacyThreeHubPage"));

const App = () => {
  const siteView = resolveSiteView();
  const projectId =
    siteView === "portfolio"
      ? new URLSearchParams(window.location.search).get("project")
      : null;

  useEffect(() => {
    const metadata = getPageMetadata(siteView, projectId);
    document.title = metadata.title;
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ]) {
      document
        .querySelector(selector)
        ?.setAttribute("content", metadata.description);
    }
    for (const selector of [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
    ]) {
      document.querySelector(selector)?.setAttribute("content", metadata.title);
    }
    const canonicalUrl = new URL("https://okorion.github.io/");
    if (projectId) canonicalUrl.searchParams.set("project", projectId);
    else if (siteView !== "portfolio")
      canonicalUrl.searchParams.set("view", siteView);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", canonicalUrl.href);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", canonicalUrl.href);
    if ("image" in metadata && metadata.image) {
      const imageUrl = new URL(metadata.image, canonicalUrl.origin).href;
      for (const selector of [
        'meta[property="og:image:width"]',
        'meta[property="og:image:height"]',
      ]) {
        document.querySelector(selector)?.remove();
      }
      document
        .querySelector('meta[property="og:image"]')
        ?.setAttribute("content", imageUrl);
      document
        .querySelector('meta[name="twitter:image"]')
        ?.setAttribute("content", imageUrl);
      for (const selector of [
        'meta[property="og:image:alt"]',
        'meta[name="twitter:image:alt"]',
      ]) {
        document
          .querySelector(selector)
          ?.setAttribute("content", metadata.imageAlt);
      }
    }
  }, [siteView, projectId]);

  if (siteView === "3d") {
    return (
      <RouteErrorBoundary>
        <Suspense
          fallback={
            <main className="route-loading" aria-busy="true" aria-live="polite">
              <p>3D Lab을 불러오는 중입니다.</p>
            </main>
          }
        >
          <LegacyThreeHubPage />
        </Suspense>
      </RouteErrorBoundary>
    );
  }

  return <PortfolioPage view={siteView} projectId={projectId} />;
};

export default App;
