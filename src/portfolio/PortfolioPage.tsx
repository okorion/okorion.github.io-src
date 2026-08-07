import type { ReactNode } from "react";
import type { SiteView } from "../app/siteView";
import {
  credentials,
  evidenceItems,
  experienceItems,
  publicProjects,
} from "./portfolioContent";
import "./portfolio.css";

const PROFILE_URL =
  "https://okorion.notion.site/Developer-Portfolio-1d50242aaedf80988f93f5af21fe0304";

interface PortfolioPageProps {
  defaultView: SiteView;
}

interface ExternalLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
}

function ExternalLink({ children, className, href }: ExternalLinkProps) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function SectionHeading({
  eyebrow,
  headingId,
  title,
  description,
}: {
  eyebrow: string;
  headingId: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <p className="section-heading__eyebrow">{eyebrow}</p>
      <div className="section-heading__body">
        <h2 id={headingId}>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function PortfolioPage({ defaultView }: PortfolioPageProps) {
  return (
    <div className="portfolio" data-default-view={defaultView}>
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>

      <header className="site-header">
        <a className="site-brand" href="/" aria-label="오현규 포트폴리오 홈">
          <span className="site-brand__mark" aria-hidden="true">
            OH
          </span>
          <span className="site-brand__copy">
            <strong>오현규</strong>
            <span>Product / Application Engineer</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="주요 섹션">
          <a href="#professional-evidence">경력 사례</a>
          <a href="#public-builds">공개 프로젝트</a>
          <a href="#experience">경력</a>
        </nav>
        <a className="site-header__lab" href="/?view=3d">
          <span className="site-header__lab-dot" aria-hidden="true" />
          3D Lab
        </a>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__glow" aria-hidden="true" />
          <div className="hero__copy">
            <p className="hero__eyebrow">
              <span aria-hidden="true">●</span>
              HYOUNKYU OH · PRODUCT / APPLICATION ENGINEER
            </p>
            <h1 id="hero-title">
              Editor·Builder의 복잡한 상태를
              <span> 저장·Runtime·서버까지 연결합니다.</span>
            </h1>
            <p className="hero__summary">
              React·TypeScript·Three.js 기반의 2D·3D Editor·Builder와 지도
              제품을 개발해 왔습니다. 편집 상태와 command·event, 저장 모델,
              Runtime 실행의 의미를 맞추고 모바일·현장·운영 환경에서 실제 동작을
              검증합니다.
            </p>
            <p className="hero__experiment">
              공개 프로젝트에서는 local-first AI, 3D·데이터 시각화 도구를
              실험합니다.
            </p>
            <nav className="hero__actions" aria-label="포트폴리오 바로가기">
              <a
                className="button button--primary"
                href="#professional-evidence"
              >
                경력 사례 보기 <span aria-hidden="true">↓</span>
              </a>
              <a className="button button--secondary" href="#public-builds">
                공개 프로젝트
              </a>
              <ExternalLink
                className="text-link"
                href="https://github.com/okorion"
              >
                GitHub
              </ExternalLink>
            </nav>
          </div>

          <a
            className="hero-visual"
            href="/?view=3d"
            aria-label="기존 인터랙티브 3D Lab 열기"
          >
            <img
              src="/favicon/og-image.png"
              alt="나무와 인물 형상의 점 구름으로 구성한 3D 장면"
              width="1200"
              height="630"
              fetchPriority="high"
            />
            <span className="hero-visual__veil" aria-hidden="true" />
            <span className="hero-visual__topline">
              <span>Original 3D experience</span>
              <span aria-hidden="true">↗</span>
            </span>
            <span className="hero-visual__caption">
              <strong>3D Lab</strong>
              <span>기존 인터랙티브 장면은 별도 경험으로 보존했습니다.</span>
            </span>
          </a>
        </section>

        <dl className="signal-strip" aria-label="핵심 프로필">
          <div>
            <dt>Experience</dt>
            <dd>2023–현재</dd>
          </div>
          <div>
            <dt>Core</dt>
            <dd>React · TypeScript</dd>
          </div>
          <div>
            <dt>Systems</dt>
            <dd>Editor · Builder · Runtime</dd>
          </div>
          <div>
            <dt>Validation</dt>
            <dd>모바일 · 현장 · 운영</dd>
          </div>
        </dl>

        <section
          className="section professional-evidence"
          id="professional-evidence"
          aria-labelledby="professional-evidence-title"
        >
          <SectionHeading
            eyebrow="01 · PROFESSIONAL EVIDENCE"
            headingId="professional-evidence-title"
            title="구현보다 먼저, 상태의 의미와 책임 경계를 맞춥니다."
            description="공개 가능한 범위에서 문제, 직접 기여, 핵심 판단, 검증 방법을 분리해 적었습니다."
          />
          <div className="evidence-list">
            {evidenceItems.map((item) => (
              <article className="evidence-card" key={item.id}>
                <div className="evidence-card__rail">
                  <span>{item.index}</span>
                  <span aria-hidden="true" />
                </div>
                <div className="evidence-card__main">
                  <div className="evidence-card__header">
                    <div>
                      <p>{item.context}</p>
                      <h3>{item.title}</h3>
                    </div>
                    <time>{item.period}</time>
                  </div>
                  <dl className="evidence-card__details">
                    <div>
                      <dt>Problem</dt>
                      <dd>{item.problem}</dd>
                    </div>
                    <div>
                      <dt>Contribution</dt>
                      <dd>{item.contribution}</dd>
                    </div>
                    <div>
                      <dt>Decision</dt>
                      <dd>{item.decision}</dd>
                    </div>
                    <div>
                      <dt>Validation</dt>
                      <dd>{item.validation}</dd>
                    </div>
                  </dl>
                  <ul className="tag-list" aria-label={`${item.title} 기술`}>
                    {item.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section public-builds"
          id="public-builds"
          aria-labelledby="public-builds-title"
        >
          <SectionHeading
            eyebrow="02 · PUBLIC BUILDS"
            headingId="public-builds-title"
            title="직접 열어보고, 코드를 확인할 수 있는 실험입니다."
            description="현업 제품과 분리된 개인 공개 프로젝트입니다. 데모의 동작 범위와 구현 경계를 함께 밝혔습니다."
          />
          <div className="project-list">
            {publicProjects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-card__visual">
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    width="1200"
                    height="630"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="project-card__number">{project.index}</span>
                </div>
                <div className="project-card__content">
                  <p className="project-card__category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="project-card__description">
                    {project.description}
                  </p>
                  <ul className="tag-list" aria-label={`${project.title} 기술`}>
                    {project.technologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                  <p className="project-card__boundary">
                    <strong>공개 범위</strong>
                    {project.boundary}
                  </p>
                  <nav
                    className="project-card__links"
                    aria-label={`${project.title} 링크`}
                  >
                    {project.links.map((link) => (
                      <ExternalLink href={link.href} key={link.href}>
                        {link.label}
                      </ExternalLink>
                    ))}
                  </nav>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section profile-section"
          id="experience"
          aria-labelledby="experience-title"
        >
          <SectionHeading
            eyebrow="03 · EXPERIENCE & CREDENTIALS"
            headingId="experience-title"
            title="제품의 편집 경험부터 실행·운영 경계까지 다뤄 왔습니다."
            description="직무 포지셔닝과 직접 연결되는 경력, 교육, 자격과 공개 특허만 간결하게 정리했습니다."
          />
          <div className="profile-grid">
            <div className="profile-panel">
              <p className="profile-panel__label">Employment</p>
              <ol className="timeline">
                {experienceItems.map((experience) => (
                  <li key={experience.company}>
                    <span className="timeline__dot" aria-hidden="true" />
                    <div className="timeline__header">
                      <div>
                        <h3>{experience.company}</h3>
                        <p>{experience.role}</p>
                      </div>
                      <time>{experience.period}</time>
                    </div>
                    <ul>
                      {experience.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>

            <div className="profile-panel profile-panel--credentials">
              <p className="profile-panel__label">Education & credentials</p>
              <ul className="credential-list">
                {credentials.map((credential) => (
                  <li key={credential}>{credential}</li>
                ))}
              </ul>
              <div className="patent-card">
                <p>Patent · 공동 발명자</p>
                <h3>웹 환경에서 3D 컴포넌트를 생성하는 방법 및 장치</h3>
                <span>대한민국 등록특허 제10-2666168호 · 2024.05</span>
                <ExternalLink href="https://patents.google.com/patent/KR102666168B1/ko">
                  Public record
                </ExternalLink>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-section" aria-labelledby="contact-title">
          <div>
            <p className="contact-section__eyebrow">VERIFIED LINKS</p>
            <h2 id="contact-title">다음 근거를 바로 확인할 수 있습니다.</h2>
            <p>
              지원용 이력서와 연락처는 채용 과정에서 전달한 최신 문서를 기준으로
              합니다.
            </p>
          </div>
          <div className="contact-section__links">
            <ExternalLink href="https://github.com/okorion">
              GitHub
            </ExternalLink>
            <ExternalLink href={PROFILE_URL}>Career Profile</ExternalLink>
            <ExternalLink href="https://okorion.github.io/tech-blog/">
              Tech Blog
            </ExternalLink>
            <a href="/?view=3d">
              3D Lab <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          업무 사례는 공개 가능한 범위에서 내부 명칭·스키마·고객 정보를
          일반화했습니다. 개인 공개 프로젝트는 현업 제품과 별개의 실험입니다.
        </p>
        <p>© 2026 Hyounkyu Oh · okorion</p>
      </footer>
    </div>
  );
}
