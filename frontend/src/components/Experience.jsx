import { useMemo } from "react";

import { ADMIN_URL } from "../api/client";
import { formatRange, paragraphs } from "../lib/format";
import { BriefcaseIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";
import { EmptyNote, SkeletonCard } from "./States";

export default function Experience({ experience = [], loading }) {
  const items = useMemo(
    () =>
      [...experience].sort(
        (a, b) => new Date(b.start_date) - new Date(a.start_date),
      ),
    [experience],
  );

  return (
    <Section
      id="experience"
      eyebrow="Career"
      title={
        <>
          Where I&apos;ve <span className="text-gradient">worked</span>
        </>
      }
      lead="Roles, teams and the problems I have helped solve along the way."
    >
      {loading && !experience.length ? (
        <div className="stack">
          <SkeletonCard rows={3} />
          <SkeletonCard rows={3} />
        </div>
      ) : items.length ? (
        <div className="timeline">
          {items.map((item, index) => (
            <Reveal
              as="article"
              key={item.id}
              delay={index * 60}
              className="timeline-item"
            >
              <span className="timeline-marker" aria-hidden="true">
                <BriefcaseIcon size={16} />
              </span>
              <div className="card timeline-card">
                <div className="timeline-head">
                  <div>
                    <h3>{item.role}</h3>
                    <p className="timeline-company">{item.company}</p>
                  </div>
                  <div className="timeline-meta">
                    <span className="pill">
                      {formatRange(item.start_date, item.end_date, item.current)}
                    </span>
                    {item.current ? (
                      <span className="pill pill-accent">Current</span>
                    ) : null}
                  </div>
                </div>
                {item.description ? (
                  <div className="timeline-body">
                    {paragraphs(item.description).map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="card empty-card">
          <EmptyNote>
            No experience listed yet.{" "}
            <a href={ADMIN_URL} target="_blank" rel="noreferrer">
              Add a role
            </a>{" "}
            to start the timeline.
          </EmptyNote>
        </div>
      )}
    </Section>
  );
}
