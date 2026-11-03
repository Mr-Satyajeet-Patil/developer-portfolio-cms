import { useMemo } from "react";

import { ADMIN_URL } from "../api/client";
import { formatYear } from "../lib/format";
import { GraduationIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";
import { EmptyNote, SkeletonGrid } from "./States";

const range = (item) => {
  const start = formatYear(item.start_year);
  const end = formatYear(item.end_year);
  if (!start && !end) return "—";
  return `${start || "—"} — ${end || "Present"}`;
};

export default function Education({ education = [], loading }) {
  const items = useMemo(
    () =>
      [...education].sort(
        (a, b) => (b.end_year ?? Infinity) - (a.end_year ?? Infinity),
      ),
    [education],
  );

  return (
    <Section
      id="education"
      eyebrow="Education"
      title={
        <>
          Always <span className="text-gradient">learning</span>
        </>
      }
      lead="Formal training, plus the habit of picking up whatever the next problem needs."
    >
      {loading && !education.length ? (
        <SkeletonGrid count={2} rows={2} />
      ) : items.length ? (
        <div className="grid grid-2">
          {items.map((item, index) => (
            <Reveal
              as="article"
              key={item.id}
              delay={(index % 4) * 70}
              className="card education-card"
            >
              <div className="education-head">
                <span className="education-icon">
                  <GraduationIcon size={20} />
                </span>
                <span className="pill">
                  {range(item)}
                </span>
              </div>
              <h3>{item.degree}</h3>
              <p className="education-institution">{item.institution}</p>
              {item.description ? (
                <p className="education-description">{item.description}</p>
              ) : null}
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="card empty-card">
          <EmptyNote>
            No education entries yet.{" "}
            <a href={ADMIN_URL} target="_blank" rel="noreferrer">
              Add one in the admin
            </a>
            .
          </EmptyNote>
        </div>
      )}
    </Section>
  );
}
