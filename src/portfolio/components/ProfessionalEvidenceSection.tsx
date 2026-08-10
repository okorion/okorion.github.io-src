import { type EvidenceItem, evidenceItems } from "../portfolioContent";
import { SectionHeading } from "./SectionHeading";

function EvidenceDetails({ item }: { item: EvidenceItem }) {
  const details = [
    ["Problem", item.problem],
    ["Contribution", item.contribution],
    ["Decision", item.decision],
    ["Validation", item.validation],
  ] as const;

  return (
    <dl className="evidence-card__details">
      {details.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function EvidenceCard({ item }: { item: EvidenceItem }) {
  return (
    <article className="evidence-card">
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
        <EvidenceDetails item={item} />
        <ul className="tag-list" aria-label={`${item.title} 기술`}>
          {item.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function ProfessionalEvidenceSection() {
  return (
    <section
      className="section professional-evidence"
      id="professional-evidence"
      aria-labelledby="professional-evidence-title"
    >
      <SectionHeading
        eyebrow="01 · SELECTED WORK"
        headingId="professional-evidence-title"
      />
      <div className="evidence-list">
        {evidenceItems.map((item) => (
          <EvidenceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
