export type Link = { label: string; href: string };

export type Experience = {
  organization: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  highlights: string[];
  technologies?: string[];
};

export type Project = {
  title: string;
  description: string;
  technologies: string[];
  links: Link[];
  featured?: boolean;
};

/**
 * Your portfolio's single source of truth. Replace the placeholders below with
 * your details. Adding array objects automatically adds content to the page.
 */
export const portfolio = {
  name: "Your Name",
  initials: "YN",
  role: "Student & software builder",
  location: "City, State",
  email: "you@example.com",
  availability: "Open to opportunities",
  intro:
    "I build thoughtful digital experiences at the intersection of technology, design, and curiosity.",
  about: [
    "Write a short introduction about who you are, what motivates you, and the kind of work you enjoy.",
    "This is a great place to add your interests beyond a résumé: the problems you care about, communities you contribute to, or the direction you are growing in.",
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://linkedin.com/in/your-handle" },
    { label: "GitHub", href: "https://github.com/your-handle" },
  ] satisfies Link[],
  education: [
    {
      organization: "Your University",
      role: "B.S. in Your Field",
      period: "Expected Month Year",
      location: "City, State",
      description:
        "Add your concentration, relevant coursework, honors, or activities here.",
      highlights: [
        "GPA or academic distinction",
        "Relevant club, research, or leadership role",
      ],
    },
  ] satisfies Experience[],
  experience: [
    {
      organization: "Company or Organization",
      role: "Internship Title",
      period: "Month Year — Month Year",
      location: "City, State or Remote",
      description:
        "Use this space for a concise overview of the team, mission, and your contribution.",
      highlights: [
        "Describe a meaningful outcome, ideally with a concrete result or scale.",
        "Describe a second contribution, responsibility, or lesson learned.",
      ],
      technologies: ["Technology", "Tool", "Method"],
    },
  ] satisfies Experience[],
  projects: [
    {
      title: "Project One",
      description:
        "A concise explanation of the problem, what you built, and why it matters. Keep it focused on the value and your role.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      links: [
        { label: "Live site", href: "https://example.com" },
        {
          label: "Source code",
          href: "https://github.com/your-handle/project",
        },
      ],
      featured: true,
    },
    {
      title: "Project Two",
      description:
        "Add another project to demonstrate a different skill, domain, or kind of problem-solving.",
      technologies: ["Technology", "Technology"],
      links: [
        {
          label: "Source code",
          href: "https://github.com/your-handle/project",
        },
      ],
    },
  ] satisfies Project[],
  skills: ["JavaScript", "TypeScript", "React", "Next.js", "Python", "Git"],
  interests: ["Add an interest", "Add a community", "Add a hobby"],
} as const;
