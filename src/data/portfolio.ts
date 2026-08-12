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
  role: string;
  period: string;
  description: string;
  highlights: string[];
  technologies: string[];
  links: Link[];
  featured?: boolean;
};

/**
 * Your portfolio's single source of truth. Replace the placeholders below with
 * your details. Adding array objects automatically adds content to the page.
 */
export const portfolio = {
  name: "Logan Dracos",
  initials: "LD",
  role: "Full-Stack Software Engineer",
  location: "Washginton, D.C.",
  email: "logandracos@gmail.com",
  availability: "Software Developer Engineer at Amazon",
  intro:
    "Hello! I'm Logan, and I like to create full-stack projects with AWS services, React, and Java. I specialize in building data-driven tools for financial systems, although I like to play around with all aspects of development. I'm excited to start in Amazon's FinTech Organization this September.",
  about: [
    "I'm originally from New York, and have been enjoying building things since high school. Starting off with basic HTML and CSS projects, I am now proficient in technologies across the tech stack. My specialty lies in cloud infrastructure (AWS), database design, and React frontend development. I enjoy working closely with customers to ensure I create impactful, easy-to-use technologies.",
    "I recently graduated in Spring 2026 from Duke with a major in Computer Science and a minor in finance. While I'll miss the North Carolina weather, I'm excited to explore a new city and new lifestyle working full time at Amazon's Arlington office.",
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/logandracos/" },
    { label: "GitHub", href: "https://github.com/dracos-l" },
  ] satisfies Link[],
  education: [
    {
      organization: "Duke University",
      role: "B.S. in Computer Science",
      period: "August 2022 - May 2026",
      location: "Durham, NC",
      description:
        "Relevant Coursework: Structures and Algorithms, Advanced Software Design and Implementation, Practical Financial Markets",
      highlights: [
        "GPA: 3.91",
        "HackDuke Code for Good Hackathon",
        "Tamid Group",
        "Duke Independent Film Festival Editorial",
      ],
    },
    {
      organization: "Horace Mann School",
      role: "High School Diploma",
      period: "September 2018 - June 2022",
      location: "Bronx, NY",
      description: "",
      highlights: [
        "Editor-in-Chief of current events magazine",
        "Captain of Soccer, Track, and Baseball teams",
      ],
    },
  ] satisfies Experience[],
  experience: [
    {
      organization: "Amazon, Fintech Organization",
      role: "Software Developer Engineer Intern",
      period: "May — August 2025",
      location: "Arlington, VA",
      description:
        "Built secure, scalable tools that streamlined case-processing workflows for Amazon investigators.",
      highlights: [
        "Designed and implemented a bulk case-upload system supporting 10,000 cases per batch with AWS CDK and Amazon Q AI assistance; integrated API Gateway, Lambda, S3, and Glue to streamline case creation for 30+ investigators.",
        "Developed an automated CSV validation pipeline with AWS Glue, Step Functions, Spark data-quality checks, DynamoDB error reporting, and encrypted cross-account permissions, enabling secure, zero-error multi-case processing.",
        "Engineered an Amazon Connect queue-management system using SQS and Lambda for case backfill operations while maintaining 80%+ unit-test coverage and documentation standards.",
      ],
      technologies: [
        "AWS CDK",
        "API Gateway",
        "Lambda",
        "S3",
        "Glue",
        "Step Functions",
        "DynamoDB",
        "SQS",
      ],
    },
    {
      organization: "VOOM Insurance",
      role: "Full-Stack Software Developer Intern",
      period: "June — August 2024",
      location: "Tel Aviv, Israel",
      description:
        "Improved the financial and legal workflows behind a digital-insurance platform.",
      highlights: [
        "Optimized financial reporting and database performance by enhancing PostgreSQL functions, modifying AWS Lambda integrations, and collaborating with product teams—improving accuracy by 50% and performance by 20%.",
        "Developed automated legal-document processing that saved the legal team 2+ hours per week, including auto-filling PDF functionality with CSHTML.",
        "Built C#/ASP.NET APIs and improved React dashboard navigation to make the product easier to use.",
      ],
      technologies: [
        "PostgreSQL",
        "AWS Lambda",
        "C#",
        "ASP.NET",
        "React",
        "CSHTML",
      ],
    },
  ] satisfies Experience[],
  projects: [
    {
      title: "2D Game Player & Authoring",
      role: "Developer",
      period: "February — May 2025",
      description:
        "A modular game engine and authoring platform for creating, playing, and sharing 2D levels.",
      highlights: [
        "Engineered a modular 2D game engine and builder platform with an Entity-Component-System architecture and recursive JSON parsing for reusable components.",
        "Abstracted database logic into a reusable service layer, making game features such as user levels, scores, and social interactions easier to extend.",
      ],
      technologies: [
        "Java",
        "JavaFX",
        "JUnit",
        "Firebase",
        "Firestore",
        "Jackson",
      ],
      links: [],
      featured: true,
    },
    {
      title: "Cell Society",
      role: "Developer",
      period: "January — March 2025",
      description:
        "A configurable cellular-automata simulation platform for diverse grid-based experiments.",
      highlights: [
        "Developed a Java-based cellular automata platform using OpenJFX and MVC architecture, enabling users to configure and run simulations through XML input files with robust error handling.",
        "Collaborated in a team of three to design, implement, and test modular simulation features using design patterns, reflection, and SOLID principles; delivered 70%+ unit-test coverage.",
      ],
      technologies: ["Java", "JavaFX", "JUnit"],
      links: [],
    },
    {
      title: "Pickup Comps",
      role: "Co-Founder, Head Frontend Developer",
      period: "September 2023 — September 2024",
      description:
        "A basketball player-comparison platform that matches user gameplay profiles to NBA players.",
      highlights: [
        "Architected a data-driven full-stack React application that analyzes user gameplay profiles against NBA statistics to generate personalized player matches using statistical analysis.",
        "Built the frontend with React Router and Sass, plus Pandas data processing to aggregate NBA API data.",
      ],
      technologies: ["React", "JavaScript", "Python", "Pandas", "Sass", "MUI"],
      links: [],
    },
  ] satisfies Project[],
  skills: ["JavaScript", "TypeScript", "React", "Next.js", "Python", "Git"],
  interests: [
    "Whitewater Canoeing",
    "NBA (Boston Celtics)",
    "Movies/Filmmaking",
    "Card Games",
  ],
} as const;
