import { type PublicProject, publicProjects } from "../portfolioContent";
import { ExternalLink } from "./ExternalLink";
import { SectionHeading } from "./SectionHeading";

function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <article className="project-card">
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
        <p className="project-card__description">{project.description}</p>
        <ul className="tag-list" aria-label={`${project.title} 기술`}>
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <p className="project-card__boundary">
          <strong>현재 구현 범위</strong>
          {project.boundary}
        </p>
        <nav
          className="project-card__links"
          aria-label={`${project.title} 링크`}
        >
          {project.links.map((link) => (
            <ExternalLink key={link.href} href={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </nav>
      </div>
    </article>
  );
}

export function PublicBuildsSection() {
  return (
    <section
      className="section public-builds"
      id="public-builds"
      aria-labelledby="public-builds-title"
    >
      <SectionHeading
        eyebrow="02 · PUBLIC BUILDS"
        headingId="public-builds-title"
      />
      <div className="project-list">
        {publicProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
