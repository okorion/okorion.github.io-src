import { siteContent } from "../portfolioContent";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p id="hero-title" className="eyebrow">
        {siteContent.eyebrow}
      </p>
      <p className="hero__summary">{siteContent.description}</p>
    </section>
  );
}
