import { siteContent } from "../portfolioContent";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="eyebrow">{siteContent.eyebrow}</p>
      <h1 id="hero-title">{siteContent.heading}</h1>
      <p className="hero__summary">{siteContent.description}</p>
    </section>
  );
}
