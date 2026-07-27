const iconProps = {
  "aria-hidden": true,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
};

export function ExternalArrowIcon() {
  return (
    <svg
      {...iconProps}
      className="nav-hub__link-arrow"
      viewBox="0 0 20 20"
      width="15"
      height="15"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M6 14L14 6" />
      <path d="M7 6h7v7" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg {...iconProps} viewBox="0 0 20 20" width="16" height="16">
      <path d="M5 5L15 15" />
      <path d="M15 5L5 15" />
    </svg>
  );
}

export function HubMarkIcon() {
  return (
    <svg
      {...iconProps}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 2.75v3.1" />
      <path d="M12 18.15v3.1" />
      <path d="M2.75 12h3.1" />
      <path d="M18.15 12h3.1" />
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg
      {...iconProps}
      viewBox="0 0 20 20"
      width="14"
      height="14"
      strokeWidth="1.7"
      strokeLinejoin="round"
    >
      <path d="M4 7l6 6 6-6" />
    </svg>
  );
}
