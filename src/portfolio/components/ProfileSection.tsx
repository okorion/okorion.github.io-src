import {
  additionalCredentials,
  credentials,
  experienceItems,
} from "../portfolioContent";
import { ExternalLink } from "./ExternalLink";
import { SectionHeading } from "./SectionHeading";

function EmploymentPanel() {
  return (
    <div className="profile-panel">
      <p className="profile-panel__label">Employment</p>
      <ol className="timeline">
        {experienceItems.map((item) => (
          <li key={`${item.company}-${item.period}`}>
            <span className="timeline__dot" aria-hidden="true" />
            <div className="timeline__header">
              <div>
                <h3>{item.company}</h3>
                <p>{item.role}</p>
              </div>
              <time>{item.period}</time>
            </div>
            <ul>
              {item.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CredentialsPanel() {
  return (
    <div className="profile-panel profile-panel--credentials">
      <p className="profile-panel__label">Education &amp; credentials</p>
      <ul className="credential-list">
        {credentials.map((credential) => (
          <li key={credential}>{credential}</li>
        ))}
      </ul>
      <details className="credential-disclosure">
        <summary>
          <span>Additional credentials</span>
          <span className="credential-disclosure__count">
            {additionalCredentials.length}
          </span>
        </summary>
        <ul className="credential-list credential-list--additional">
          {additionalCredentials.map((credential) => (
            <li key={credential}>{credential}</li>
          ))}
        </ul>
      </details>
      <div className="patent-card">
        <p>Patent · 공동 발명자</p>
        <h3>웹 환경에서 3D 컴포넌트를 생성하는 방법 및 장치</h3>
        <span>대한민국 등록특허 제10-2666168호 · 2024.05</span>
        <ExternalLink href="https://patents.google.com/patent/KR102666168B1/ko">
          Public record
        </ExternalLink>
      </div>
    </div>
  );
}

export function ProfileSection() {
  return (
    <section
      className="section profile-section"
      id="experience"
      aria-labelledby="experience-title"
    >
      <SectionHeading
        eyebrow="04 · EXPERIENCE & CREDENTIALS"
        headingId="experience-title"
      />
      <div className="profile-grid">
        <EmploymentPanel />
        <CredentialsPanel />
      </div>
    </section>
  );
}
