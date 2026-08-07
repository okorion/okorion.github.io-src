import type { ReactNode } from "react";

interface ExternalLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
}

export function ExternalLink({ children, className, href }: ExternalLinkProps) {
  return (
    <a
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
