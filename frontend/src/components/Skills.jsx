import { useMemo } from "react";

import { ADMIN_URL } from "../api/client";
import { SparkleIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";
import { EmptyNote, SkeletonGrid } from "./States";

export default function Skills({ skills = [], loading }) {
  const groups = useMemo(() => {
    const map = new Map();
    for (const skill of skills) {
      const category = skill.category?.trim() || "General";
      if (!map.has(category)) map.set(category, []);
      map.get(category).push(skill);
    }

    return [...map.entries()]
      .map(([category, items]) => ({
        category,
        items: items.sort(
          (a, b) => b.level - a.level || a.name.localeCompare(b.name),
        ),
      }))
      .sort(
        (a, b) =>
          b.items.length - a.items.length ||
          a.category.localeCompare(b.category),
      );
  }, [skills]);

  return (
    <Section
      id="skills"
      eyebrow="Toolbox"
      title={
        <>
          Skills &amp; <span className="text-gradient">technologies</span>
        </>
      }
      lead="The tools I reach for most, grouped by how I use them. Levels are an honest self-assessment, not a scoreboard."
    >
      {loading && !skills.length ? (
        <SkeletonGrid count={2} rows={5} />
      ) : groups.length ? (
        <div className="grid grid-2 skills-grid">
          {groups.map((group, index) => (
            <Reveal
              as="article"
              key={group.category}
              delay={(index % 4) * 70}
              className="card skill-group"
            >
              <header className="skill-group-head">
                <span className="skill-group-icon">
                  <SparkleIcon size={16} />
                </span>
                <h3>{group.category}</h3>
                <span className="pill">{group.items.length}</span>
              </header>

              <ul className="skill-list">
                {group.items.map((skill) => (
                  <li key={skill.id}>
                    <div className="skill-label">
                      <span>{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div
                      className="skill-track"
                      role="progressbar"
                      aria-label={skill.name}
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span
                        className="skill-fill"
                        style={{ "--level": `${skill.level}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="card empty-card">
          <EmptyNote>
            No skills added yet.{" "}
            <a href={ADMIN_URL} target="_blank" rel="noreferrer">
              Add some in the admin
            </a>{" "}
            and they will show up here.
          </EmptyNote>
        </div>
      )}
    </Section>
  );
}
