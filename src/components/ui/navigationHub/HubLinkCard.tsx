import { ExternalArrowIcon } from "./NavigationHubIcons";
import type { HubLink } from "./navigationLinks";

export function HubLinkCard({ label, description, href, icon }: HubLink) {
  return (
    <a
      className="nav-hub__link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} 새 탭에서 열기`}
    >
      <span className="nav-hub__icon" aria-hidden="true">
        <img src={icon} alt="" width="22" height="22" />
      </span>
      <span className="nav-hub__link-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <ExternalArrowIcon />
    </a>
  );
}
