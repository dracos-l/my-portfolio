export type Link = { label: string; href: string };

export type Experience = {
  organization: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  highlights: string[];
  technologies?: string[];
  startYear?: string;
  endYear?: string;
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
  tooltip: string;
};

export type SkillGroup = {
  category: string;
  items: {
    name: string;
    level: 1 | 2 | 3 | 4 | 5;
  }[];
};

export type QuizQuestion = {
  question: string;
  options: readonly string[];
  answer: number;
  explanation: string;
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
    "I'm originally from New York and have been building things since high school, starting off with basic HTML and CSS projects and growing from there into a full stack of technologies. These days, I focus on cloud infrastructure and data-driven apps, designing scalable systems on AWS and building the databases and React frontends that bring them to life. I especailly enjoy projects that combine tech and finance that real people can use.",
    "I recently graduated in Spring 2026 from Duke with a major in Computer Science and a minor in finance. I'll be moving to D.C. in early September. While I'll miss the North Carolina weather, I'm excited to explore a new city and new lifestyle working full time at Amazon's Arlington office.",
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/logandracos/" },
    { label: "GitHub", href: "https://github.com/dracos-l" },
  ] satisfies Link[],
  quizQuestions: [
    {
      question: "What did I say I'm going to miss most about North Carolina?",
      options: ["The sunsets", "Cookout", "The nice weather", "Waffle House"],
      answer: 2,
      explanation:
        "I will miss miss all of these deeply. But the weather was the best",
    },
    {
      question:
        "Who was the professor for CS308, my most impactful software design class?",
      options: [
        "Professor Fain",
        "Professor Duvall",
        "Professor O'Hanlon",
        "Professor Caccavale",
      ],
      answer: 1,
      explanation:
        "All of these Duke professors were incredible. And I TA'd for Professor Duvall senior year!",
    },
    {
      question: "Which sport is one of my outside-of-work interests?",
      options: [
        "Whitewater canoeing",
        "Rock climbing",
        "Surfing",
        "Ice hockey",
      ],
      answer: 0,
      explanation:
        "Whitewater canoeing is one of my favorite ways to get outside.",
    },
    {
      question:
        "Which language was used for the 2D Game Player & Authoring project?",
      options: ["Go", "Rust", "Swift", "Java"],
      answer: 3,
      explanation:
        "The game engine and authoring platform was built with Java and JavaFX. It was a great way to get low-level and understand what goes into such game development",
    },
    {
      question: "Where did I build Amora, my dating app project?",
      options: ["Arlington", "North Carolina", "Madrid", "New York"],
      answer: 2,
      explanation:
        "I did this project while studying abroad in Madrid! I liked the project a lot and loved Madrid.",
    },
  ] satisfies readonly QuizQuestion[],
  education: [
    {
      organization: "Duke University",
      role: "B.S. in Computer Science",
      period: "August 2022 - May 2026",
      startYear: "2022",
      endYear: "2026",
      location: "Durham, NC",
      description: "Minor in Finance.",
      highlights: [
        "GPA: 3.91",
        "HackDuke Code for Good Hackathon",
        "Tamid Group",
        "Duke Independent Film Festival Editorial",
        "Relevant Coursework: Structures and Algorithms, Advanced Software Design and Implementation, Practical Financial Markets",
        "Undergraduate Teaching Assistant for CS 308: Advanced Software Design and Implementation",
      ],
    },
    {
      organization: "Horace Mann School",
      role: "High School Diploma",
      period: "September 2018 - June 2022",
      startYear: "2018",
      endYear: "2022",
      location: "Bronx, NY",
      description: "",
      highlights: [
        "Editor-in-Chief of current events magazine",
        "Captain of Soccer, Track, and Baseball teams",
        "Awarded MVP/Sportsmanship award",
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
        "Built secure, scalable case-processing tools for Amazon FinTech investigators.",
      highlights: [
        "Built an AWS CDK bulk-upload workflow for up to 10,000 cases, connecting API Gateway, Lambda, S3, and Glue for 30+ investigators.",
        "Automated CSV validation with Glue, Step Functions, Spark, DynamoDB, and encrypted cross-account access for secure, zero-error multi-case processing.",
        "Created Amazon Connect backfill tooling with SQS and Lambda, maintaining 80%+ unit-test coverage.",
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
        "React",
      ],
    },
    {
      organization: "VOOM Insurance",
      role: "Full-Stack Software Developer Intern",
      period: "June — August 2024",
      location: "Tel Aviv, Israel",
      description:
        "Improved financial reporting and legal-document workflows for a digital-insurance platform.",
      highlights: [
        "Improved PostgreSQL functions and AWS Lambda integrations, raising reporting accuracy by 50% and performance by 20%.",
        "Automated legal-document PDFs, saving the legal team 2+ hours each week.",
        "Built C#/ASP.NET APIs and clearer React dashboard navigation.",
      ],
      technologies: [
        "PostgreSQL",
        "AWS Lambda",
        "C#",
        "ASP.NET",
        "React",
        "CSHTML",
        "Python",
      ],
    },
  ] satisfies Experience[],
  projects: [
    {
      title: "2D Game Player & Authoring",
      role: "Developer",
      period: "March — May 2025",
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
      links: [
        { label: "GitHub", href: "https://github.com/dracos-l/oogasalad" },
      ],
      featured: true,
      tooltip:
        "This was an 8 person project! Distributing work and coordinating progress was a challenge, but it was extremely rewarding to see the final product.",
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
      links: [
        { label: "GitHub", href: "https://github.com/dracos-l/cellsociety" },
      ],
      tooltip:
        "This was a three person project, and I did a lot of work on the simulation logic. It was a challenge having to continuously rethink the cell simulation design to account for new requirements. Shoutout CS308 and Professor Duvall!",
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
      links: [
        { label: "GitHub", href: "https://github.com/dracos-l/pickupcompsv2" },
      ],
      tooltip:
        "This is my favorite personal project, you really can't find another tool like this online. I'm very proud of it, having developed it with basically no AI use.",
    },
    {
      title: "Bearish",
      role: "Developer",
      period: "September 2023",
      description:
        "A mobile app built at HackDuke that makes reading business and tech news more engaging.",
      highlights: [
        "Built a React Native mobile app in 24 hours with a team of four, integrating OpenAI, NewsAPI, and Extractor API to summarize and surface business/tech news.",
        "Collaborated across a four-person team under hackathon time constraints to ship a functional cross-platform app from concept to demo.",
      ],
      technologies: ["React Native", "JavaScript", "OpenAI API", "NewsAPI"],
      links: [
        { label: "GitHub", href: "https://github.com/dracos-l/hackduke23" },
      ],
      tooltip:
        "This was a super fun project! Certainly not the cleanest since it was done in a time crunch, but I had a great time with it.",
    },
    {
      title: "Amora",
      role: "Co-Developer",
      period: "October - December 2024",
      description:
        "A matchmaking web application that helps users find dinner dates through preference-based matching.",
      highlights: [
        "Built a full-stack Flask web app with user authentication, editable profiles, and a preference-based matching and date-proposal system.",
        "Implemented dynamic features like a 'Surprise Me' matcher, live compliment sending via the Fetch API, and cuisine-based date proposals with table-availability handling.",
      ],
      technologies: [
        "Python",
        "Flask",
        "Flask-SQLAlchemy",
        "MySQL",
        "Jinja2",
        "Bootstrap",
        "JavaScript",
      ],
      links: [
        { label: "GitHub", href: "https://github.com/dracos-l/DatingApp" },
      ],
      tooltip:
        "This was a part of a class I took in my study abroad in Madrid. It was my first time using many of these technologies, and it was fun doing a project in a different way than I had before.",
    },
    {
      title: "Breakout",
      role: "Sole Developer",
      period: "January 2025",
      description:
        "A JavaFX implementation of the classic Breakout arcade game with multiple levels and power-ups.",
      highlights: [
        "Built a multi-level Breakout game in Java and JavaFX, including paddle/ball physics, brick collision, scorekeeping, and a lives system.",
        "Designed a randomized power-up system (paddle resizing, ball speed, etc.) spawning from bricks, plus cheat-key level navigation and restart functionality.",
      ],
      technologies: ["Java", "JavaFX"],
      links: [
        { label: "GitHub", href: "https://github.com/dracos-l/breakout" },
      ],
      tooltip:
        "This is my only solo project (outside internships). It was very cool to play around with the collision and physics at such a low level.",
    },
  ] satisfies Project[],
  skillGroups: [
    {
      category: "Languages",
      items: [
        { name: "Java", level: 5 },
        { name: "JavaScript/Typescript", level: 4 },
        { name: "SQL", level: 4 },
        { name: "Python", level: 4 },
        { name: "C#", level: 3 },
      ],
    },
    {
      category: "Frameworks",
      items: [
        { name: "React", level: 5 },
        { name: "AWS CDK", level: 4 },
        { name: "Next.js", level: 4 },
        { name: "ASP.NET", level: 3 },
      ],
    },
    {
      category: "Tools & platforms",
      items: [
        { name: "AWS", level: 5 },
        { name: "Git", level: 5 },
        { name: "PostgreSQL", level: 4 },
        { name: "Firebase", level: 3 },
      ],
    },
  ] satisfies SkillGroup[],
  interests: [
    "Whitewater Canoeing",
    "NBA (Boston Celtics)",
    "Movies/Filmmaking",
    "Card Games",
  ],
} as const;
