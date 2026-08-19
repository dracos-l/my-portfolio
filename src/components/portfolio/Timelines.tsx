import Image from "next/image";
import amazonLogo from "@/data/Amazon_logo.svg.png";
import voomLogo from "@/data/voom.png";

export type TimelineEntry = {
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

function logoFor(organization: string) {
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
}

export function ExperienceTimeline({
  entries,
}: {
  entries: readonly TimelineEntry[];
}) {
  return (
    <div className="timeline timeline-experience">
      {entries.map((entry) => {
        const logo = logoFor(entry.organization);

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

export function EducationTimeline({
  entries,
}: {
  entries: readonly TimelineEntry[];
}) {
  return (
    <div className="education-chronology">
      {entries.map((entry, index) => (
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
          {index < entries.length - 1 && (
            <div className="education-break" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}
