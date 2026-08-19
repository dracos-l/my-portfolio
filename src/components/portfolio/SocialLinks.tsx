import Image from "next/image";
import linkedInIcon from "@/data/LinkedIn-Icon-Black-Logo.wine.svg";
import githubIcon from "@/data/Octicons-mark-github.svg";
import { portfolio } from "@/data/portfolio";

export function SocialLinks() {
  return (
    <div className="social-links social-links-hero">
      {portfolio.socialLinks.map((link) => {
        const icon = link.label === "GitHub" ? githubIcon : linkedInIcon;
        const iconClass = link.label.toLowerCase();

        return (
          <a
            aria-label={link.label}
            className={`social-icon-link social-icon-link-${iconClass}`}
            href={link.href}
            key={link.label}
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt=""
              className={`social-icon social-icon-${iconClass}`}
              src={icon}
            />
          </a>
        );
      })}
    </div>
  );
}
