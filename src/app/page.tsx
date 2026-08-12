import { portfolio } from "@/data/portfolio";

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="text-link" href={href} rel="noreferrer" target="_blank">
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

type TimelineEntry = {
  organization: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  highlights: readonly string[];
  technologies?: readonly string[];
};

function Timeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <div className="timeline">
      {entries.map((entry) => (
        <article
          className="timeline-item"
          key={`${entry.organization}-${entry.role}`}
        >
          <div className="timeline-marker" aria-hidden="true" />
          <p className="entry-period">{entry.period}</p>
          <h3>{entry.role}</h3>
          <p className="entry-organization">
            {entry.organization}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
          <p className="entry-description">{entry.description}</p>
          <ul className="highlights">
            {entry.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          {entry.technologies && (
            <div className="tags">
              {entry.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: (typeof portfolio.projects)[number];
  featured?: boolean;
}) {
  return (
    <article className={`project-card${featured ? " project-featured" : ""}`}>
      <div className="project-number">
        {featured ? "Featured project" : "Personal project"}
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
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
    </article>
  );
}

export default function Home() {
  const featuredProjects = portfolio.projects.filter(
    (project) => project.featured,
  );
  const remainingProjects = portfolio.projects.filter(
    (project) => !project.featured,
  );
  return (
    <main>
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="monogram" href="#top" aria-label="Back to top">
          {portfolio.initials}
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
        </div>
        <a className="nav-contact" href={`mailto:${portfolio.email}`}>
          Let&apos;s talk <span aria-hidden="true">↗</span>
        </a>
      </nav>
      <section className="hero" id="top">
        <div className="eyebrow">
          <span /> {portfolio.availability}
        </div>
        <p className="hero-kicker">Hello, I&apos;m</p>
        <h1>{portfolio.name}.</h1>
        <p className="hero-role">{portfolio.role}</p>
        <p className="hero-intro">{portfolio.intro}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            Explore my work <span>↓</span>
          </a>
          <a className="button button-quiet" href={`mailto:${portfolio.email}`}>
            Get in touch
          </a>
        </div>
        <div className="hero-footer">
          <p>{portfolio.location}</p>
          <div className="social-links">
            {portfolio.socialLinks.map((link) => (
              <ExternalLink key={link.label} {...link} />
            ))}
          </div>
        </div>
      </section>
      <section className="section about-section" id="about">
        <p className="section-label">01 / About me</p>
        <div className="section-content about-content">
          <h2>
            A little more
            <br />
            about me.
          </h2>
          <div className="prose">
            {portfolio.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="mini-list">
              <p className="mini-label">Outside of work</p>
              <p>{portfolio.interests.join(" · ")}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="experience">
        <p className="section-label">02 / Experience</p>
        <div className="section-content">
          <h2>
            Where I&apos;ve
            <br />
            learned &amp; built.
          </h2>
          <Timeline entries={portfolio.experience} />
        </div>
      </section>
      <section className="section education-section">
        <p className="section-label">03 / Education</p>
        <div className="section-content">
          <h2>The foundation.</h2>
          <Timeline entries={portfolio.education} />
        </div>
      </section>
      <section className="section projects-section" id="projects">
        <p className="section-label">04 / Selected work</p>
        <div className="section-content">
          <div className="projects-heading">
            <h2>
              Things I&apos;ve
              <br />
              made.
            </h2>
            <p>
              Each project begins with a question and ends with something
              useful.
            </p>
          </div>
          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} featured />
            ))}
            {remainingProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </section>
      <section className="skills-strip" aria-label="Skills">
        <p>Tools I work with</p>
        <div>
          {portfolio.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
      <footer className="site-footer">
        <p className="section-label">05 / Contact</p>
        <div>
          <p className="footer-question">Have something in mind?</p>
          <a className="footer-email" href={`mailto:${portfolio.email}`}>
            {portfolio.email} <span>↗</span>
          </a>
        </div>
        <p className="footer-bottom">
          © {new Date().getFullYear()} {portfolio.name}
        </p>
      </footer>
    </main>
  );
}
