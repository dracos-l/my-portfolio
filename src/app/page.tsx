"use client";

import Image from "next/image";
import {
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent,
  type TouchEvent,
  useEffect,
  useState,
} from "react";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SkillGroups } from "@/components/portfolio/SkillGroups";
import { SocialLinks } from "@/components/portfolio/SocialLinks";
import { StickyNotes } from "@/components/portfolio/StickyNotes";
import {
  EducationTimeline,
  ExperienceTimeline,
} from "@/components/portfolio/Timelines";
import canoeingPicture from "@/data/canoeing_picture.jpg";
import mailIcon from "@/data/free-mail-icon-142-thumb.png";
import headshot from "@/data/Headshot.jpeg";
import initials from "@/data/Initials.svg";
import menuIcon from "@/data/menu-two-line-solid-rounded-512.webp";
import { type Project, portfolio } from "@/data/portfolio";

const PROJECT_ORDER_STORAGE_KEY = "logan-dracos-project-order";
const NAVIGATION_LINKS = [
  ["experience", "Experience"],
  ["education", "Education"],
  ["projects", "Projects"],
  ["about", "About"],
  ["stickies", "Stickies"],
] as const;
const DEFAULT_PROJECT_ORDER = [...portfolio.projects]
  .sort((first, second) => first.order - second.order)
  .map((project) => project.id);
const PROJECTS_BY_ID = new Map<string, Project>(
  portfolio.projects.map((project) => [project.id, project]),
);
const LEGACY_PROJECT_IDS_BY_TITLE = new Map(
  portfolio.projects.map((project) => [project.title, project.id]),
);

type ProjectSlot =
  | { kind: "project"; project: Project }
  | { kind: "empty"; key: string };

function normalizeProjectOrder(value: unknown) {
  if (!Array.isArray(value)) return DEFAULT_PROJECT_ORDER;

  const validIds = value.flatMap((item) => {
    if (typeof item !== "string") return [];

    const id = PROJECTS_BY_ID.has(item)
      ? item
      : LEGACY_PROJECT_IDS_BY_TITLE.get(item);
    return id ? [id] : [];
  });
  const uniqueIds = [...new Set(validIds)];
  const missingIds = DEFAULT_PROJECT_ORDER.filter(
    (id) => !uniqueIds.includes(id),
  );

  return [...uniqueIds, ...missingIds];
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [projectOrder, setProjectOrder] = useState<string[]>([]);
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const projectSlots: ProjectSlot[] = [];
  let hasUnpairedHalfWidthProject = false;

  for (const id of projectOrder) {
    const project = PROJECTS_BY_ID.get(id);
    if (!project) continue;

    if (project.layout !== "standard" && hasUnpairedHalfWidthProject) {
      projectSlots.push({ kind: "empty", key: `empty-before-${id}` });
      hasUnpairedHalfWidthProject = false;
    }

    projectSlots.push({ kind: "project", project });

    if (project.layout === "standard") {
      hasUnpairedHalfWidthProject = !hasUnpairedHalfWidthProject;
    }
  }

  if (hasUnpairedHalfWidthProject) {
    projectSlots.push({ kind: "empty", key: "empty-at-end" });
  }

  useEffect(() => {
    const storedOrder = window.localStorage.getItem(PROJECT_ORDER_STORAGE_KEY);
    if (!storedOrder) {
      setProjectOrder(DEFAULT_PROJECT_ORDER);
      return;
    }

    try {
      setProjectOrder(normalizeProjectOrder(JSON.parse(storedOrder)));
    } catch {
      setProjectOrder(DEFAULT_PROJECT_ORDER);
    }
  }, []);

  useEffect(() => {
    const sectionIds = NAVIGATION_LINKS.map(([id]) => id);

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

  const saveProjectOrder = (nextOrder: string[]) => {
    setProjectOrder(nextOrder);
    window.localStorage.setItem(
      PROJECT_ORDER_STORAGE_KEY,
      JSON.stringify(nextOrder),
    );
  };

  const swapProjects = (fromId: string, toId: string) => {
    if (fromId === toId) return;

    const nextOrder = [...projectOrder];
    const fromIndex = nextOrder.indexOf(fromId);
    const toIndex = nextOrder.indexOf(toId);
    if (fromIndex < 0 || toIndex < 0) return;

    [nextOrder[fromIndex], nextOrder[toIndex]] = [
      nextOrder[toIndex],
      nextOrder[fromIndex],
    ];
    saveProjectOrder(nextOrder);
  };

  const moveProject = (id: string, direction: -1 | 1) => {
    const currentIndex = projectOrder.indexOf(id);
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
    id: string,
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", id);
    setDraggedProjectId(id);
    setDropTargetId(null);
  };

  const handleProjectDragEnter = (
    event: DragEvent<HTMLElement>,
    id: string,
  ) => {
    event.preventDefault();
    if (draggedProjectId && draggedProjectId !== id) setDropTargetId(id);
  };

  const handleProjectDrop = (event: DragEvent<HTMLElement>, id: string) => {
    event.preventDefault();
    const fromId = event.dataTransfer.getData("text/plain") || draggedProjectId;
    if (fromId) swapProjects(fromId, id);
    setDraggedProjectId(null);
    setDropTargetId(null);
  };

  const handleProjectTouchStart = (
    event: PointerEvent<HTMLButtonElement>,
    id: string,
  ) => {
    if (event.pointerType === "mouse") return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggedProjectId(id);
    setDropTargetId(null);
  };

  const handleProjectTouchMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" || !draggedProjectId) return;

    const targetId = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-project-id]")?.dataset.projectId;

    if (targetId && targetId !== draggedProjectId) setDropTargetId(targetId);
  };

  const handleProjectTouchEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse") return;

    if (draggedProjectId && dropTargetId) {
      swapProjects(draggedProjectId, dropTargetId);
    }
    setDraggedProjectId(null);
    setDropTargetId(null);
  };

  const handleProjectKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    id: string,
  ) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveProject(id, -1);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveProject(id, 1);
    }
  };

  const updatePattern = (
    element: HTMLElement,
    clientX: number,
    clientY: number,
  ) => {
    const bounds = element.getBoundingClientRect();
    element.style.setProperty(
      "--pattern-x",
      `${(clientX - bounds.left) * -0.12}px`,
    );
    element.style.setProperty(
      "--pattern-y",
      `${(clientY - bounds.top) * -0.12}px`,
    );
  };

  const handlePatternPointerMove = (event: PointerEvent<HTMLElement>) => {
    updatePattern(event.currentTarget, event.clientX, event.clientY);
  };

  const handlePatternTouchMove = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    if (touch) updatePattern(event.currentTarget, touch.clientX, touch.clientY);
  };

  const updateHeaderPattern = (clientX: number, clientY: number) => {
    const target = document.getElementById(activeSection ?? "top");
    if (target) updatePattern(target, clientX, clientY);
  };

  return (
    <main>
      <header
        className={`site-header${activeSection ? ` site-header-${activeSection}` : ""}`}
        onPointerMove={(event) =>
          updateHeaderPattern(event.clientX, event.clientY)
        }
        onTouchMove={(event) => {
          const touch = event.touches[0];
          if (touch) updateHeaderPattern(touch.clientX, touch.clientY);
        }}
      >
        <nav aria-label="Primary navigation" className="site-nav">
          <a aria-label="Back to top" className="monogram" href="#top">
            <span className="initials-crop">
              <Image
                alt={`${portfolio.name} initials`}
                className="initials-logo"
                src={initials}
              />
            </span>
          </a>
          <div className="nav-links">
            {NAVIGATION_LINKS.map(([id, label]) => (
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
        onPointerMove={handlePatternPointerMove}
        onTouchMove={handlePatternTouchMove}
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
          <SocialLinks />
        </div>
      </section>

      <section
        className="section experience-section"
        id="experience"
        onPointerMove={handlePatternPointerMove}
        onTouchMove={handlePatternTouchMove}
      >
        <p className="section-label">01 / Experience</p>
        <div className="section-content">
          <h2>
            My relevant
            <br />
            work experience.
          </h2>
          <ExperienceTimeline entries={portfolio.experience} />
        </div>
      </section>

      <section
        className="section education-section"
        id="education"
        onPointerMove={handlePatternPointerMove}
        onTouchMove={handlePatternTouchMove}
      >
        <p className="section-label">02 / Education</p>
        <div className="section-content">
          <EducationTimeline entries={portfolio.education} />
        </div>
      </section>

      <section
        className="section projects-section"
        id="projects"
        onPointerMove={handlePatternPointerMove}
        onTouchMove={handlePatternTouchMove}
      >
        <p className="section-label">03 / Selected work</p>
        <div className="section-content">
          <div className="projects-heading">
            <h2>Personal Projects</h2>
            <div className="projects-controls">
              <p>
                Drag a card to make this wall yours. Your order stays saved
                here.
              </p>
              <button
                onClick={() => saveProjectOrder(DEFAULT_PROJECT_ORDER)}
                type="button"
              >
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

              const { project } = slot;
              return (
                <article
                  aria-label={`Reorder ${project.title}. Use arrow keys or drag to move it.`}
                  className={`project-sortable project-${project.layout} ${
                    draggedProjectId === project.id ? "is-dragging" : ""
                  } ${dropTargetId === project.id ? "is-drop-target" : ""}`}
                  data-project-id={project.id}
                  key={project.id}
                  onDragEnd={() => {
                    setDraggedProjectId(null);
                    setDropTargetId(null);
                  }}
                  onDragEnter={(event) =>
                    handleProjectDragEnter(event, project.id)
                  }
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleProjectDrop(event, project.id)}
                >
                  <button
                    aria-label={`Move ${project.title} with the arrow keys`}
                    className="project-drag-hint"
                    draggable
                    onDragStart={(event) =>
                      handleProjectDragStart(event, project.id)
                    }
                    onKeyDown={(event) =>
                      handleProjectKeyDown(event, project.id)
                    }
                    onPointerCancel={handleProjectTouchEnd}
                    onPointerDown={(event) =>
                      handleProjectTouchStart(event, project.id)
                    }
                    onPointerMove={handleProjectTouchMove}
                    onPointerUp={handleProjectTouchEnd}
                    type="button"
                  >
                    ⋮⋮ drag to swap
                  </button>
                  <ProjectCard project={project} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="section about-section"
        id="about"
        onPointerMove={handlePatternPointerMove}
        onTouchMove={handlePatternTouchMove}
      >
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
              <p key={paragraph}>{paragraph}</p>
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
                Ratings reflect my relative proficiency based on hands-on
                experience.
              </p>
            </div>
            <SkillGroups />
          </div>
        </div>
      </section>

      <StickyNotes />
    </main>
  );
}
