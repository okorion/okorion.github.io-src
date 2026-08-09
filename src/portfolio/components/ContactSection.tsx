import { ExternalLink } from "./ExternalLink";

const PROFILE_URL =
  "https://okorion.notion.site/Developer-Portfolio-1d50242aaedf80988f93f5af21fe0304";

export function ContactSection() {
  return (
    <section className="contact-section" aria-labelledby="contact-title">
      <div>
        <p className="contact-section__eyebrow">EXPLORE MORE</p>
        <h2 id="contact-title">프로젝트와 경력, 기술 글을 더 살펴보세요.</h2>
        <p>지원용 이력서와 연락처는 채용 과정에서 별도로 공유합니다.</p>
      </div>
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
