import { type PublicProject, projectHref } from "../portfolioContent";
import { ExternalLink } from "./ExternalLink";
import { ProjectMedia } from "./ProjectMedia";

interface PublicBuildsSectionProps {
  items: readonly PublicProject[];
  heading?: string;
}

export function PublicBuildsSection({
  items,
  heading,
}: PublicBuildsSectionProps) {
  return (
    <section
      className="projects-section"
      id="projects"
      aria-label={heading ?? "프로젝트 목록"}
    >
      {heading && (
        <div className="section-heading">
          <h2>{heading}</h2>
          <span>도구 · 업무 지원 · 시각 경험</span>
        </div>
      )}
      <div className="project-list">
        {items.map((project, index) => {
          const demo = project.links.find((link) => link.kind === "demo");
          return (
            <article className="project-row" key={project.id}>
              <ProjectMedia
                image={project.image}
                eager={index === 0}
                href={projectHref(project.id)}
              />
              <div className="project-row__copy">
                <div className="project-meta">
                  <span className="project-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{project.category}</span>
                </div>
                <h3>
                  <a href={projectHref(project.id)}>{project.title}</a>
                </h3>
                <p className="project-row__description">
                  {project.description}
                </p>
                <nav
                  className="project-actions"
                  aria-label={`${project.title} 링크`}
                >
                  {demo && (
                    <ExternalLink
                      href={demo.href}
                      ariaLabel={`${project.title} ${demo.label} · 새 탭`}
                    >
                      {demo.label}
                    </ExternalLink>
                  )}
                  <a
                    className={demo ? "secondary-link" : undefined}
                    href={projectHref(project.id)}
                  >
                    {demo ? "제작 과정" : "사례 읽기"}
                    <span aria-hidden="true">→</span>
                  </a>
                </nav>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
