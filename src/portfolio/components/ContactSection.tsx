import { ExternalLink } from "./ExternalLink";

const PROFILE_URL =
  "https://okorion.notion.site/Developer-Portfolio-1d50242aaedf80988f93f5af21fe0304";

export function ContactSection() {
  return (
    <section className="contact-section" aria-labelledby="contact-title">
      <h2 id="contact-title" className="contact-section__eyebrow">
        EXPLORE MORE
      </h2>
      <div className="contact-section__links">
        <ExternalLink href="https://github.com/okorion">GitHub</ExternalLink>
        <ExternalLink href={PROFILE_URL}>Career Profile</ExternalLink>
        <ExternalLink href="https://velog.io/@okorion">
          Technical Writing
        </ExternalLink>
        <a href="/?view=3d">
          3D Lab <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
