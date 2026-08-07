import { lazy, Suspense } from "react";
import "./App.css";
import { RouteErrorBoundary } from "./app/RouteErrorBoundary";
import { DEFAULT_SITE_VIEW, resolveSiteView } from "./app/siteView";
import { PortfolioPage } from "./portfolio/PortfolioPage";

const LegacyThreeHubPage = lazy(() => import("./legacy/LegacyThreeHubPage"));

const App = () => {
  const siteView = resolveSiteView();

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

  return <PortfolioPage defaultView={DEFAULT_SITE_VIEW} />;
};

export default App;
