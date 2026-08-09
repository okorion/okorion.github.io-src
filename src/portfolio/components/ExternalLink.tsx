import type { ReactNode } from "react";

interface ExternalLinkProps {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  href: string;
}

export function ExternalLink({
  ariaLabel,
  children,
  className,
  href,
}: ExternalLinkProps) {
  return (
    <a
      aria-label={ariaLabel}
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
