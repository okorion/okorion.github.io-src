import { credentials, patent, siteContent } from "../portfolioContent";
import { ExternalLink } from "./ExternalLink";

export function ProfileSection() {
  return (
    <div className="about-page">
      <header className="page-intro">
        <p className="eyebrow">ABOUT</p>
        <h1>{siteContent.aboutTitle}</h1>
        <p>{siteContent.aboutDescription}</p>
      </header>
      <section className="detail-section" aria-labelledby="making-title">
        <h2 id="making-title">프로젝트 작업 방식</h2>
        <div>
          <p>{siteContent.humanRole}</p>
          <p>{siteContent.aiRole}</p>
          <a className="inline-link" href="/?view=projects">
            프로젝트 둘러보기 <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
      <section className="detail-section" aria-labelledby="credentials-title">
        <h2 id="credentials-title">자격</h2>
        <ul className="credential-list">
          {credentials.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="detail-section" aria-labelledby="patent-title">
        <h2 id="patent-title">특허</h2>
        <div className="patent-record">
          <p className="patent-role">{patent.role}</p>
          <h3>{patent.title}</h3>
          <p>{patent.record}</p>
          <ExternalLink href={patent.href}>공개 등록 기록</ExternalLink>
        </div>
      </section>
    </div>
  );
}
