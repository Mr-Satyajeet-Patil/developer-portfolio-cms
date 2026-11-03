import { useMemo, useState } from "react";

import { ADMIN_URL } from "../api/client";
import { splitList } from "../lib/format";
import { GithubIcon, ExternalLinkIcon, ArrowUpRightIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";
import { EmptyNote, SkeletonGrid } from "./States";

export default function Projects({ projects = [], loading }) {
  const [filter, setFilter] = useState("All");

  const sorted = useMemo(
    () =>
      [...projects].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.created_at) - new Date(a.created_at);
      }),
    [projects],
  );

  const technologies = useMemo(() => {
    const counts = new Map();
    for (const project of projects) {
      for (const tech of splitList(project.technologies)) {
        counts.set(tech, (counts.get(tech) || 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 10)
      .map(([tech]) => tech);
  }, [projects]);

  const visible = useMemo(
    () =>
      filter === "All"
        ? sorted
        : sorted.filter((project) =>
            splitList(project.technologies).includes(filter),
          ),
    [filter, sorted],
  );

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title={
        <>
          Things I&apos;ve <span className="text-gradient">built</span>
        </>
      }
      lead="A selection of products, experiments and tools. Each one taught me something new."
      action={
        technologies.length ? (
          <div className="filter-chips" role="group" aria-label="Filter projects">
            {["All", ...technologies].map((tech) => (
              <button
                key={tech}
                type="button"
                className={`chip chip-button${filter === tech ? " is-active" : ""}`}
                aria-pressed={filter === tech}
                onClick={() => setFilter(tech)}
              >
                {tech}
              </button>
            ))}
          </div>
        ) : null
      }
    >
      {loading && !projects.length ? (
        <SkeletonGrid count={3} rows={4} />
      ) : !projects.length ? (
        <div className="card empty-card">
          <EmptyNote>
            No projects published yet.{" "}
            <a href={ADMIN_URL} target="_blank" rel="noreferrer">
              Add your first project
            </a>
            .
          </EmptyNote>
          <a
            className="btn btn-ghost btn-small"
            href={ADMIN_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open admin
            <ArrowUpRightIcon size={16} />
          </a>
        </div>
      ) : visible.length ? (
        <div className="grid grid-2 projects-grid">
          {visible.map((project, index) => {
            const techs = splitList(project.technologies);
            return (
              <Reveal
                as="article"
                key={project.id}
                delay={(index % 4) * 70}
                className={`card project-card${project.featured ? " is-featured" : ""}`}
              >
                <div className="project-top">
                  <span className="project-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {project.featured ? (
                    <span className="pill pill-accent">Featured</span>
                  ) : null}
                </div>

                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>

                {techs.length ? (
                  <ul className="chip-row" aria-label="Technologies used">
                    {techs.map((tech) => (
                      <li key={tech} className="chip chip-static">
                        {tech}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="project-links">
                  {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <GithubIcon size={17} />
                      Source
                    </a>
                  ) : null}
                  {project.live_url ? (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <ExternalLinkIcon size={17} />
                      Live site
                    </a>
                  ) : null}
                  {!project.github_url && !project.live_url ? (
                    <span className="project-nolink">Case study on request</span>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="card empty-card">
          <EmptyNote>
            Nothing matches <strong>{filter}</strong> yet.
          </EmptyNote>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => setFilter("All")}
          >
            Show all projects
          </button>
        </div>
      )}
    </Section>
  );
}
