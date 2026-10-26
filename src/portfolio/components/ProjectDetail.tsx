import { lazy, Suspense } from "react";
import { getProject, projectHref, projects } from "../portfolioContent";
import { ExternalLink } from "./ExternalLink";
import { ProjectMedia } from "./ProjectMedia";

const ProjectArchitecture = lazy(() => import("./ProjectArchitecture"));

export function ProjectDetail({ projectId }: { projectId: string }) {
  const project = getProject(projectId);

  if (!project) {
    return (
      <section className="page-intro empty-page">
        <p className="eyebrow">PROJECTS</p>
        <h1>프로젝트를 찾을 수 없습니다.</h1>
        <p>주소를 확인하거나 전체 목록에서 프로젝트를 골라 주세요.</p>
        <a className="inline-link" href="/?view=projects">
          전체 프로젝트 <span aria-hidden="true">→</span>
        </a>
      </section>
    );
  }

  const index = projects.findIndex((item) => item.id === project.id);
  const nextProject = projects[(index + 1) % projects.length];
  const primaryLinks = project.links.filter((link) => link.kind !== "article");
  const articles = project.links.filter((link) => link.kind === "article");

  return (
    <article className="project-detail">
      <a className="back-link" href="/?view=projects">
        <span aria-hidden="true">←</span> 전체 프로젝트
      </a>
      <header className="detail-heading">
        <div className="detail-heading__copy">
          <p className="eyebrow">{project.category}</p>
          <h1>{project.title}</h1>
          <p className="detail-summary">{project.description}</p>
          {primaryLinks.length > 0 && (
            <nav className="project-actions" aria-label="프로젝트 열기">
              {primaryLinks.map((link) => (
                <ExternalLink key={link.href} href={link.href}>
                  {link.label}
                </ExternalLink>
              ))}
            </nav>
          )}
        </div>
        <ProjectMedia image={project.brand} eager variant="brand" />
      </header>
      <ProjectMedia image={project.image} eager />
      <section
        className="detail-section flow-section"
        aria-labelledby="flow-title"
      >
        <h2 id="flow-title">사용 흐름</h2>
        <ol className="project-flow">
          {project.flow.map((step, stepIndex) => (
            <li key={step}>
              <span>{String(stepIndex + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>
      <Suspense
        fallback={
          <section className="detail-section" aria-busy="true">
            <h2>프로젝트 구조</h2>
            <p>구조도를 불러오는 중입니다.</p>
          </section>
        }
      >
        <ProjectArchitecture key={project.id} projectId={project.id} />
      </Suspense>
      <div className="detail-body">
        {project.sections.map((section) => (
          <section className="detail-section" key={section.title}>
            <h2>{section.title}</h2>
            <div>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
      {project.extraImages?.map((image) => (
        <ProjectMedia key={image.src} image={image} />
      ))}
      {articles.length > 0 && (
        <section className="detail-section related-writing">
          <h2>관련 기록</h2>
          <div>
            {articles.map((link) => (
              <ExternalLink key={link.href} href={link.href}>
                {link.label}
              </ExternalLink>
            ))}
          </div>
        </section>
      )}
      <nav className="detail-bottom-nav" aria-label="다른 프로젝트">
        <a href="/?view=projects">
          <span aria-hidden="true">←</span> 전체 프로젝트
        </a>
        <a href={projectHref(nextProject.id)}>
          <span>다음 프로젝트</span>
          <strong>{nextProject.title} →</strong>
        </a>
      </nav>
    </article>
  );
}
