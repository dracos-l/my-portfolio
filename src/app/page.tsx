"use client";

import Image from "next/image";
import { type DragEvent, type KeyboardEvent, useEffect, useState } from "react";
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

const PROJECT_LAYOUT = [
  { title: "2D Game Player & Authoring", variant: "featured" as const },
  { title: "Cell Society", variant: "standard" as const },
  { title: "Amora", variant: "standard" as const },
  { title: "Pickup Comps", variant: "pickup" as const },
  { title: "Bearish", variant: "standard" as const },
  { title: "Breakout", variant: "standard" as const },
];
const PROJECT_ORDER_STORAGE_KEY = "logan-dracos-project-order";

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

function ProjectCard({ project }: { project: Project }) {
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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [projectOrder, setProjectOrder] = useState<string[]>([]);
  const [draggedProject, setDraggedProject] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const projectByTitle = new Map(
    portfolio.projects.map((project) => [project.title, project]),
  );
  const projectSlots: Array<
    { kind: "project"; title: string } | { kind: "empty"; key: string }
  > = [];
  let hasUnpairedHalfWidthProject = false;

  for (const title of projectOrder) {
    const layout = PROJECT_LAYOUT.find((item) => item.title === title);

    if (!layout) continue;

    if (layout.variant !== "standard" && hasUnpairedHalfWidthProject) {
      projectSlots.push({ kind: "empty", key: `empty-before-${title}` });
      hasUnpairedHalfWidthProject = false;
    }

    projectSlots.push({ kind: "project", title });

    if (layout.variant === "standard") {
      hasUnpairedHalfWidthProject = !hasUnpairedHalfWidthProject;
    }
  }

  if (hasUnpairedHalfWidthProject) {
    projectSlots.push({ kind: "empty", key: "empty-at-end" });
  }
  useEffect(() => {
    const availableTitles = PROJECT_LAYOUT.map(({ title }) => title);
    const storedOrder = window.localStorage.getItem(PROJECT_ORDER_STORAGE_KEY);

    if (!storedOrder) {
      setProjectOrder(availableTitles);
      return;
    }

    try {
      const parsedOrder = JSON.parse(storedOrder) as string[];
      const validOrder = parsedOrder.filter((title) =>
        availableTitles.includes(title),
      );
      const missingTitles = availableTitles.filter(
        (title) => !validOrder.includes(title),
      );

      setProjectOrder([...validOrder, ...missingTitles]);
    } catch {
      setProjectOrder(availableTitles);
    }
  }, []);

  const saveProjectOrder = (nextOrder: string[]) => {
    setProjectOrder(nextOrder);
    window.localStorage.setItem(
      PROJECT_ORDER_STORAGE_KEY,
      JSON.stringify(nextOrder),
    );
  };

  const swapProjects = (fromTitle: string, toTitle: string) => {
    if (fromTitle === toTitle) return;

    const nextOrder = [...projectOrder];
    const fromIndex = nextOrder.indexOf(fromTitle);
    const toIndex = nextOrder.indexOf(toTitle);

    if (fromIndex < 0 || toIndex < 0) return;

    [nextOrder[fromIndex], nextOrder[toIndex]] = [
      nextOrder[toIndex],
      nextOrder[fromIndex],
    ];
    saveProjectOrder(nextOrder);
  };

  const resetProjectOrder = () => {
    const defaultOrder = PROJECT_LAYOUT.map(({ title }) => title);
    saveProjectOrder(defaultOrder);
  };

  const moveProject = (title: string, direction: -1 | 1) => {
    const currentIndex = projectOrder.indexOf(title);
    const nextIndex = currentIndex + direction;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= projectOrder.length) {
      return;
    }

    const nextOrder = [...projectOrder];
    [nextOrder[currentIndex], nextOrder[nextIndex]] = [
      nextOrder[nextIndex],
      nextOrder[currentIndex],
    ];
    saveProjectOrder(nextOrder);
  };

  const handleProjectDragStart = (
    event: DragEvent<HTMLElement>,
    title: string,
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", title);
    setDraggedProject(title);
    setDropTarget(null);
  };

  const handleProjectDragEnter = (
    event: DragEvent<HTMLElement>,
    title: string,
  ) => {
    event.preventDefault();

    if (draggedProject && draggedProject !== title) {
      setDropTarget(title);
    }
  };

  const handleProjectDrop = (event: DragEvent<HTMLElement>, title: string) => {
    event.preventDefault();
    const fromTitle =
      event.dataTransfer.getData("text/plain") || draggedProject;

    if (fromTitle) swapProjects(fromTitle, title);
    setDraggedProject(null);
    setDropTarget(null);
  };

  const handleProjectKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    title: string,
  ) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveProject(title, -1);
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveProject(title, 1);
    }
  };

  useEffect(() => {
    const sectionIds = ["experience", "education", "projects", "about"];

    const updateActiveSection = () => {
      const activationPoint = window.scrollY + 78 + window.innerHeight * 0.32;
      const currentSection = sectionIds.reduce<string | null>((active, id) => {
        const section = document.getElementById(id);

        return section && section.offsetTop <= activationPoint ? id : active;
      }, null);

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

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
            {[
              ["experience", "Experience"],
              ["education", "Education"],
              ["projects", "Projects"],
              ["about", "About"],
            ].map(([id, label]) => (
              <a
                aria-current={activeSection === id ? "location" : undefined}
                className={activeSection === id ? "is-active" : undefined}
                href={`#${id}`}
                key={id}
              >
                {label}
              </a>
            ))}
          </div>
          <details className="nav-menu">
            <summary aria-label="Open menu">
              <Image alt="" className="nav-menu-icon" src={menuIcon} />
            </summary>
            <div className="nav-menu-panel">
              <a href={`mailto:${portfolio.email}`}>Contact me</a>
              <a href="/quiz">Take the quiz</a>
              <a download href="/Dracos_Logan_Resume.pdf">
                Download resume
              </a>
            </div>
          </details>
        </nav>
      </header>
      <section
        className="hero"
        id="top"
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty(
            "--cursor-x",
            `${event.clientX - bounds.left}px`,
          );
          event.currentTarget.style.setProperty(
            "--cursor-y",
            `${event.clientY - bounds.top}px`,
          );
        }}
      >
        <div className="headshot-frame">
          <Image
            alt="Portrait of Logan Dracos"
            className="headshot"
            placeholder="blur"
            priority
            src={headshot}
          />
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
            <div className="projects-controls">
              <p>
                Drag a card to make this wall yours. Your order stays saved
                here.
              </p>
              <button onClick={resetProjectOrder} type="button">
                Reset order
              </button>
            </div>
          </div>
          <div className="projects-grid">
            {projectSlots.map((slot) => {
              if (slot.kind === "empty") {
                return (
                  <div
                    aria-hidden="true"
                    className="project-empty-slot"
                    key={slot.key}
                  />
                );
              }

              const { title } = slot;
              const project = projectByTitle.get(title);
              const layout = PROJECT_LAYOUT.find(
                (item) => item.title === title,
              );

              return project && layout ? (
                <article
                  aria-label={`Reorder ${project.title}. Use arrow keys or drag to move it.`}
                  className={`project-sortable project-${layout.variant} ${
                    draggedProject === title ? "is-dragging" : ""
                  } ${dropTarget === title ? "is-drop-target" : ""}`}
                  key={project.title}
                  onDragEnd={() => {
                    setDraggedProject(null);
                    setDropTarget(null);
                  }}
                  onDragEnter={(event) => handleProjectDragEnter(event, title)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleProjectDrop(event, title)}
                >
                  <button
                    aria-label={`Move ${project.title} with the arrow keys`}
                    className="project-drag-hint"
                    draggable
                    onDragStart={(event) =>
                      handleProjectDragStart(event, title)
                    }
                    onKeyDown={(event) => handleProjectKeyDown(event, title)}
                    type="button"
                  >
                    ⋮⋮ drag to swap
                  </button>
                  <ProjectCard project={project} />
                </article>
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
