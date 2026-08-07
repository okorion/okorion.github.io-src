interface SectionHeadingProps {
  description: string;
  eyebrow: string;
  headingId: string;
  title: string;
}

export function SectionHeading({
  description,
  eyebrow,
  headingId,
  title,
}: SectionHeadingProps) {
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
