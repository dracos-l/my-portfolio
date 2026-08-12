import Image from "next/image";
import amazonLogo from "@/data/Amazon_logo.svg.png";
import canoeingPicture from "@/data/canoeing_picture.jpg";
import mailIcon from "@/data/free-mail-icon-142-thumb.png";
import headshot from "@/data/Headshot.jpeg";
import initials from "@/data/Initials.svg";
import linkedInIcon from "@/data/LinkedIn-Icon-Black-Logo.wine.svg";
import menuIcon from "@/data/menu-two-line-solid-rounded-512.webp";
import githubIcon from "@/data/Octicons-mark-github.svg";
import { type Project, portfolio } from "@/data/portfolio";
import voomLogo from "@/data/voom.png";

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="text-link" href={href} rel="noreferrer" target="_blank">
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

function SocialLinks({
  variant = "default",
}: {
  variant?: "default" | "hero";
}) {
  return (
    <div className={`social-links social-links-${variant}`}>
      {portfolio.socialLinks.map((link) => {
        const icon = link.label === "GitHub" ? githubIcon : linkedInIcon;

        return (
          <a
            aria-label={link.label}
            className={`social-icon-link social-icon-link-${link.label.toLowerCase()}`}
            href={link.href}
            key={link.label}
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt=""
              className={`social-icon social-icon-${link.label.toLowerCase()}`}
              src={icon}
            />
            {variant !== "hero" && <span>{link.label}</span>}
          </a>
        );
      })}
    </div>
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
  startYear?: string;
  endYear?: string;
};

function Timeline({
  entries,
  variant = "default",
}: {
  entries: readonly TimelineEntry[];
  variant?: "default" | "experience" | "education";
}) {
  const logoFor = (organization: string) => {
    if (organization.startsWith("Amazon")) {
      return {
        image: amazonLogo,
        label: "Amazon",
        href: "https://www.amazon.com",
      };
    }
    if (organization.startsWith("VOOM")) {
      return {
        image: voomLogo,
        label: "VOOM Insurance",
        href: "https://www.voominsurance.com",
      };
    }
    return undefined;
  };

  return (
    <div className={`timeline timeline-${variant}`}>
      {entries.map((entry) => {
        const logo =
          variant === "experience" ? logoFor(entry.organization) : undefined;

        return (
          <article
            className="timeline-item"
            key={`${entry.organization}-${entry.role}`}
          >
            <div className="entry-topline">
              <div>
                <p className="entry-period">{entry.period}</p>
                <h3>{entry.role}</h3>
                <p className="entry-organization">
                  {entry.organization}
                  {entry.location ? ` · ${entry.location}` : ""}
                </p>
              </div>
              {logo && (
                <a
                  aria-label={`Visit ${logo.label}`}
                  className="entry-logo"
                  href={logo.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Image alt={`${logo.label} logo`} src={logo.image} />
                </a>
              )}
            </div>
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
        );
      })}
    </div>
  );
}

function ProjectCard({
  project,
  variant,
}: {
  project: Project;
  variant: "featured" | "standard" | "pickup";
}) {
  return (
    <article className={`project-card project-${variant}`}>
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
    </article>
  );
}

function EducationTimeline({ entries }: { entries: readonly TimelineEntry[] }) {
  const chronologicalEntries = entries;

  return (
    <div className="education-chronology">
      {chronologicalEntries.map((entry, index) => (
        <div key={`${entry.organization}-${entry.role}`}>
          <article className="education-chapter">
            <div className="education-rail">
              <span>{entry.endYear}</span>
              <i />
              <span>{entry.startYear}</span>
            </div>
            <div className="education-card">
              <p className="entry-period">{entry.period}</p>
              <h3>{entry.role}</h3>
              <p className="entry-organization">
                {entry.organization}
                {entry.location ? ` · ${entry.location}` : ""}
              </p>
              {entry.description && (
                <p className="entry-description">{entry.description}</p>
              )}
              <ul className="highlights">
                {entry.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
          {index < chronologicalEntries.length - 1 && (
            <div className="education-break" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

function SkillLevel({ level }: { level: number }) {
  const bubbles = ["one", "two", "three", "four", "five"];

  return (
    <div
      aria-label={`${level} out of 5 comfort level`}
      className="skill-level"
      role="img"
    >
      {bubbles.map((bubble, index) => (
        <span className={index < level ? "is-filled" : ""} key={bubble} />
      ))}
    </div>
  );
}

function SkillGroups() {
  return (
    <div className="skill-groups">
      {portfolio.skillGroups.map((group) => (
        <div className="skill-group" key={group.category}>
          <h3>{group.category}</h3>
          <div className="skill-list">
            {group.items.map((skill) => (
              <div className="skill-item" key={skill.name}>
                <span>{skill.name}</span>
                <SkillLevel level={skill.level} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const projectByTitle = new Map(
    portfolio.projects.map((project) => [project.title, project]),
  );
  const projectLayout = [
    { title: "2D Game Player & Authoring", variant: "featured" as const },
    { title: "Cell Society", variant: "standard" as const },
    { title: "Amora", variant: "standard" as const },
    { title: "Pickup Comps", variant: "pickup" as const },
    { title: "Bearish", variant: "standard" as const },
    { title: "Breakout", variant: "standard" as const },
  ];
  return (
    <main>
      <header className="site-header">
        <nav className="site-nav" aria-label="Primary navigation">
          <a className="monogram" href="#top" aria-label="Back to top">
            <span className="initials-crop">
              <Image
                alt={`${portfolio.name} initials`}
                className="initials-logo"
                src={initials}
              />
            </span>
          </a>
          <div className="nav-links">
            <a href="#experience">Experience</a>
            <a href="#education">Education</a>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
          </div>
          <details className="nav-menu">
            <summary aria-label="Open menu">
              <Image alt="" className="nav-menu-icon" src={menuIcon} />
            </summary>
            <div className="nav-menu-panel">
              <a href={`mailto:${portfolio.email}`}>Contact me</a>
              <a href="/quiz">Take the quiz</a>
              <a download href="/Dracos_Logan_Resume.pdf">
                Download résumé
              </a>
            </div>
          </details>
        </nav>
      </header>
      <section className="hero" id="top">
        <div className="headshot-frame">
          <Image
            alt="Portrait of Logan Dracos"
            className="headshot"
            placeholder="blur"
            priority
            src={headshot}
          />
        </div>
        <div className="eyebrow">
          <span /> {portfolio.availability}
        </div>
        <h1>{portfolio.name}</h1>
        <div className="hero-role-line">
          <p className="hero-role">{portfolio.role}</p>
          <span className="hero-location">{portfolio.location}</span>
        </div>
        <p className="hero-intro">{portfolio.intro}</p>
        <div className="hero-footer">
          <a
            aria-label={`Email ${portfolio.name}`}
            className="hero-icon-link hero-icon-link-email"
            href={`mailto:${portfolio.email}`}
          >
            <Image
              alt=""
              className="hero-icon hero-icon-email"
              src={mailIcon}
            />
          </a>
          <SocialLinks variant="hero" />
        </div>
      </section>
      <section className="section experience-section" id="experience">
        <p className="section-label">01 / Experience</p>
        <div className="section-content">
          <h2>
            My relevant
            <br />
            work experience.
          </h2>
          <Timeline entries={portfolio.experience} variant="experience" />
        </div>
      </section>
      <section className="section education-section" id="education">
        <p className="section-label">02 / Education</p>
        <div className="section-content">
          <EducationTimeline entries={portfolio.education} />
        </div>
      </section>
      <section className="section projects-section" id="projects">
        <p className="section-label">03 / Selected work</p>
        <div className="section-content">
          <div className="projects-heading">
            <h2>Personal Projects</h2>
          </div>
          <div className="projects-grid">
            {projectLayout.map(({ title, variant }) => {
              const project = projectByTitle.get(title);

              return project ? (
                <ProjectCard
                  key={project.title}
                  project={project}
                  variant={variant}
                />
              ) : null;
            })}
          </div>
        </div>
      </section>
      <section className="section about-section" id="about">
        <p className="section-label">04 / About me</p>
        <div className="section-content about-content">
          <div className="about-visual">
            <h2>
              A little more
              <br />
              about me.
            </h2>
            <figure className="canoeing-photo">
              <Image
                alt="Logan canoeing on a lake"
                className="canoeing-image"
                sizes="(max-width: 900px) 100vw, 50vw"
                src={canoeingPicture}
              />
            </figure>
          </div>
          <div className="prose">
            {portfolio.about.map((paragraph) => (
              <p key={paragraph} className="mb-4">
                {paragraph}
              </p>
            ))}
            <div className="mini-list">
              <p className="mini-label">Outside of work</p>
              <p>{portfolio.interests.join(" · ")}</p>
            </div>
          </div>
          <div className="about-skills">
            <div className="about-skills-heading">
              <h3>Skills &amp; tools.</h3>
              <p>
                Five bubbles represent my comfort level with each technology.
              </p>
            </div>
            <SkillGroups />
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <p className="footer-question">
          Reach me using the link in the top right!
        </p>
        <p className="footer-bottom">
          © {new Date().getFullYear()} {portfolio.name}
        </p>
      </footer>
    </main>
  );
}
