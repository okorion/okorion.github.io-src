interface SectionHeadingProps {
  description: string;
  eyebrow: string;
  headingId: string;
  title?: string;
}

export function SectionHeading({
  description,
  eyebrow,
  headingId,
  title,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {title ? (
        <p className="section-heading__eyebrow">{eyebrow}</p>
      ) : (
        <h2 id={headingId} className="section-heading__eyebrow">
          {eyebrow}
        </h2>
      )}
      <div className="section-heading__body">
        {title ? (
          <h2 id={headingId} className="section-heading__title">
            {title}
          </h2>
        ) : null}
        <p>{description}</p>
      </div>
    </div>
  );
}
