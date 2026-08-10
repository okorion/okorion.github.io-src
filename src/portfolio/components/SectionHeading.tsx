interface SectionHeadingProps {
  eyebrow: string;
  headingId: string;
}

export function SectionHeading({ eyebrow, headingId }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <h2 id={headingId} className="section-heading__eyebrow">
        {eyebrow}
      </h2>
    </div>
  );
}
