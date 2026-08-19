import { portfolio } from "@/data/portfolio";

const SKILL_LEVELS = ["one", "two", "three", "four", "five"];

function SkillLevel({ level }: { level: number }) {
  return (
    <div
      aria-label={`${level} out of 5 comfort level`}
      className="skill-level"
      role="img"
    >
      {SKILL_LEVELS.map((skillLevel, index) => (
        <span className={index < level ? "is-filled" : ""} key={skillLevel} />
      ))}
    </div>
  );
}

export function SkillGroups() {
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
