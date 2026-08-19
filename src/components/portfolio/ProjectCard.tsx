import type { Project } from "@/data/portfolio";

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="text-link" href={href} rel="noreferrer" target="_blank">
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card">
      <div className="project-number">
        {project.role} · {project.period}
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <ul className="project-highlights">
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      <div className="tags">
        {project.technologies.map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>
      <div className="project-links">
        {project.links.map((link) => (
          <ExternalLink key={link.label} {...link} />
        ))}
      </div>
      <div className="project-tooltip" role="tooltip">
        <span>Project highlight</span>
        <p>{project.tooltip}</p>
      </div>
    </div>
  );
}
