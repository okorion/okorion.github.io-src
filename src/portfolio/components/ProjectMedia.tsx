import { useState } from "react";
import type { ProjectImage } from "../portfolioContent";

interface ProjectMediaProps {
  image: ProjectImage;
  eager?: boolean;
  href?: string;
}

export function ProjectMedia({
  image,
  eager = false,
  href,
}: ProjectMediaProps) {
  const [failed, setFailed] = useState(false);
  const picture = (
    <div className="project-media__frame">
      {failed ? (
        <div
          className="project-media__fallback"
          role="img"
          aria-label={image.alt}
        >
          <span>이미지를 불러오지 못했습니다.</span>
        </div>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          width="1280"
          height="720"
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );

  return (
    <figure className="project-media">
      {href ? <a href={href}>{picture}</a> : picture}
      <figcaption>{image.caption}</figcaption>
    </figure>
  );
}
