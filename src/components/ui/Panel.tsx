const links = [
  {
    label: "GitHub",
    href: "https://github.com/okorion",
  },
  {
    label: "Tech Blog",
    href: "https://okorion.github.io/tech-blog/",
  },
  {
    label: "Portfolio",
    href: "https://okorion.notion.site/Portfolio-1d50242aaedf80988f93f5af21fe0304",
  },
];

const Panel = () => {
  return (
    <aside className="brand-panel" aria-label="Site introduction and links">
      <div className="brand-panel__surface">
        <p className="eyebrow">okorion</p>
        <h1 className="brand-title">3D hub for selected projects and notes.</h1>
        <p className="brand-copy">
          The scene stays visible first. This layer only adds context, quick
          navigation, and a stable reading surface.
        </p>

        <div className="brand-actions">
          {links.map((link) => (
            <a
              key={link.href}
              className="brand-link"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="brand-meta">
          <span>Drag or scroll to orbit</span>
          <span>Dark canvas, light touch</span>
        </div>
      </div>
    </aside>
  );
};

export default Panel;
