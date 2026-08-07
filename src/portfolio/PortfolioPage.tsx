import type { SiteView } from "../app/siteView";
import { ContactSection } from "./components/ContactSection";
import { HeroSection } from "./components/HeroSection";
import { ProfessionalEvidenceSection } from "./components/ProfessionalEvidenceSection";
import { ProfileSection } from "./components/ProfileSection";
import { PublicBuildsSection } from "./components/PublicBuildsSection";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import "./portfolio.css";

interface PortfolioPageProps {
  defaultView: SiteView;
}

export function PortfolioPage({ defaultView }: PortfolioPageProps) {
  return (
    <div className="portfolio" data-default-view={defaultView}>
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <ProfessionalEvidenceSection />
        <PublicBuildsSection />
        <ProfileSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
