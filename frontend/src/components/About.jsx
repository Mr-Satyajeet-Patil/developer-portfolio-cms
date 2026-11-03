import { MailIcon, MapPinIcon, BriefcaseIcon, CodeIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";
import { EmptyNote, Skeleton } from "./States";
import SocialLinks from "./SocialLinks";

export default function About({ profile, skills = [], experience = [], loading }) {
  const paragraphs = String(profile?.bio || "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  const focus = [...new Set(skills.map((skill) => skill.category).filter(Boolean))]
    .slice(0, 4)
    .join(" · ");

  const current = experience.find((item) => item.current) || experience[0];

  return (
    <Section
      id="about"
      eyebrow="About"
      title={
        <>
          A developer who cares about the{" "}
          <span className="text-gradient">whole product</span>
        </>
      }
      lead="The short version: I enjoy turning ambiguous ideas into interfaces and systems that feel simple to use."
    >
      <div className="about-grid">
        <Reveal className="card about-story">
          {loading && !profile ? (
            <div className="stack">
              <Skeleton className="skeleton-line" />
              <Skeleton className="skeleton-line" />
              <Skeleton className="skeleton-line skeleton-line-sm" />
              <Skeleton className="skeleton-line" />
            </div>
          ) : paragraphs.length ? (
            paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <EmptyNote>
              No bio yet. Add one in the Django admin and it will appear here.
            </EmptyNote>
          )}

          <SocialLinks profile={profile} size={18} showLabels />
        </Reveal>

        <Reveal className="about-side" delay={120}>
          <div className="card facts-card">
            <h3>Quick facts</h3>
            <ul className="fact-list">
              <li>
                <span className="fact-icon">
                  <MapPinIcon size={17} />
                </span>
                <div>
                  <small>Based in</small>
                  <strong>{profile?.location || "Somewhere on Earth"}</strong>
                </div>
              </li>
              <li>
                <span className="fact-icon">
                  <MailIcon size={17} />
                </span>
                <div>
                  <small>Email</small>
                  {profile?.email ? (
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  ) : (
                    <strong>Not set</strong>
                  )}
                </div>
              </li>
              <li>
                <span className="fact-icon">
                  <BriefcaseIcon size={17} />
                </span>
                <div>
                  <small>Currently</small>
                  <strong>
                    {current
                      ? `${current.role} at ${current.company}`
                      : "Open to opportunities"}
                  </strong>
                </div>
              </li>
              <li>
                <span className="fact-icon">
                  <CodeIcon size={17} />
                </span>
                <div>
                  <small>Focus areas</small>
                  <strong>{focus || "Web development"}</strong>
                </div>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
