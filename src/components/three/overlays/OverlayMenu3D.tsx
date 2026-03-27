import { Html } from "@react-three/drei";
import { ReactNode } from "react";

interface OverlayLinkProps {
  label: string;
  badge?: string;
  url: string;
  icon?: ReactNode;
  variant?: "default" | "anchor";
}

const OverlayLink = ({
  label,
  badge,
  url,
  icon,
  variant = "default",
}: OverlayLinkProps) => {
  const accessibleLabel = badge ? `${badge} ${label}` : label;
  const isAnchor = variant === "anchor";
  const widthClassName = isAnchor
    ? "w-[9rem]"
    : label === "Portfolio"
      ? "w-[10rem]"
      : "w-[12.2rem]";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${accessibleLabel} (opens in a new tab)`}
      className={[
        "pointer-events-auto group inline-flex items-center gap-2.5 rounded-[1rem] border no-underline backdrop-blur-md",
        "transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/70",
        "hover:-translate-y-0.5 active:translate-y-0",
        isAnchor
          ? "min-h-[3.1rem] border-white/18 bg-white/70 px-3.75 py-2.5 text-black shadow-[0_10px_24px_rgba(0,0,0,0.14)] hover:bg-white/78 hover:shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
          : "min-h-[3.35rem] border-white/22 bg-white/78 px-3.75 py-2.75 text-black shadow-[0_12px_28px_rgba(0,0,0,0.16)] hover:bg-white/88 hover:shadow-[0_16px_34px_rgba(0,0,0,0.22)]",
        widthClassName,
      ].join(" ")}
    >
      <span className="flex h-[2.15rem] w-[2.15rem] shrink-0 items-center justify-center rounded-[0.8rem] bg-black/10 ring-1 ring-black/8">
        {icon && typeof icon === "string" ? (
          <img
            src={icon}
            alt=""
            aria-hidden="true"
            width="19"
            height="19"
            className="shrink-0 object-contain opacity-90 transition-transform duration-200 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          icon
        )}
      </span>
      <span className="flex min-w-0 items-center gap-1.5">
        {badge ? (
          <span className="shrink-0 rounded-full border border-black/8 bg-black/6 px-1.75 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-black/54">
            {badge}
          </span>
        ) : null}
        <span
          className={
            isAnchor
              ? "truncate text-[0.98rem] font-semibold tracking-[-0.035em] text-black/84"
              : "truncate text-[1rem] font-semibold tracking-[-0.035em] text-black/88"
          }
        >
          {label}
        </span>
      </span>
    </a>
  );
};

export const OverlayMenu3D = () => {
  return (
    <Html position={[0.02, 0.12, 1.2]} transform scale={0.074}>
      <div className="pointer-events-none flex flex-col items-start gap-3">
        <div className="pl-2">
          <OverlayLink
            label="okorion"
            url="https://github.com/okorion"
            icon="/icons/github.svg"
            variant="anchor"
          />
        </div>
        <div className="flex items-center gap-3">
          <OverlayLink
            badge="Jekyll"
            label="Tech Blog"
            url="https://okorion.github.io/tech-blog/"
            icon="/icons/jekyll.svg"
          />
          <OverlayLink
            badge="Velog"
            label="Tech Blog"
            url="https://velog.io/@okorion"
            icon="/icons/velog.svg"
          />
          <OverlayLink
            label="Portfolio"
            url="https://okorion.notion.site/Portfolio-1d50242aaedf80988f93f5af21fe0304"
            icon="/icons/notion.svg"
          />
        </div>
      </div>
    </Html>
  );
};
