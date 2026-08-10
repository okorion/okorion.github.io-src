import {
  type TechnicalWritingItem,
  technicalWritingItems,
} from "../portfolioContent";
import { ExternalLink } from "./ExternalLink";
import { SectionHeading } from "./SectionHeading";

function WritingCard({ item }: { item: TechnicalWritingItem }) {
  return (
    <article className="writing-card">
      <header className="writing-card__meta">
        <p>
          {item.index} · {item.category}
        </p>
        <time dateTime={item.publishedAt}>{item.publishedLabel}</time>
      </header>
      <h3>{item.title}</h3>
      <p className="writing-card__summary">{item.summary}</p>
      <div className="writing-card__takeaway">
        <strong>Key takeaway</strong>
        <p>{item.takeaway}</p>
      </div>
      <ul className="tag-list" aria-label={`${item.title} 주제`}>
        {item.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <ExternalLink
        ariaLabel={`${item.title} — Read on Velog`}
        className="writing-card__link"
        href={item.href}
      >
        Read on Velog
      </ExternalLink>
    </article>
  );
}

export function TechnicalWritingSection() {
  return (
    <section
      className="section technical-writing"
      id="technical-writing"
      aria-labelledby="technical-writing-title"
    >
      <SectionHeading
        eyebrow="03 · Technical Writing"
        headingId="technical-writing-title"
      />
      <div className="writing-list">
        {technicalWritingItems.map((item) => (
          <WritingCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
