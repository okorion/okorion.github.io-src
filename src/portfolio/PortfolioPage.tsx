import type { SiteView } from "../app/siteView";
import { ContactSection } from "./components/ContactSection";
import { HeroSection } from "./components/HeroSection";
import { ProfessionalEvidenceSection } from "./components/ProfessionalEvidenceSection";
import { ProfileSection } from "./components/ProfileSection";
import { PublicBuildsSection } from "./components/PublicBuildsSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { TechnicalWritingSection } from "./components/TechnicalWritingSection";
import { usePortfolioTheme } from "./usePortfolioTheme";
import "./portfolio.css";

interface PortfolioPageProps {
  defaultView: SiteView;
}

export function PortfolioPage({ defaultView }: PortfolioPageProps) {
  const { theme, toggleTheme } = usePortfolioTheme();

  return (
    <div
      className="portfolio"
      data-default-view={defaultView}
      data-theme={theme}
    >
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <SiteHeader theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content">
        <HeroSection />
        <ProfessionalEvidenceSection />
        <PublicBuildsSection />
        <TechnicalWritingSection />
        <ProfileSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
