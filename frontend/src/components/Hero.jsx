import { ADMIN_URL, mediaUrl } from "../api/client";
import {
  ArrowUpRightIcon,
  MapPinIcon,
  MailIcon,
  SparkleIcon,
} from "./Icons";
import { Skeleton } from "./States";
import SocialLinks from "./SocialLinks";
import { initials, totalExperienceYears } from "../lib/format";

function Stat({ value, label }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function Hero({
  profile,
  projects = [],
  skills = [],
  experience = [],
  loading,
  hasError = false,
}) {
  const name = profile?.name || "Your Name";
  const headline = profile?.headline || "Full-stack developer";
  const bio = profile?.bio?.split(/\n{2,}/)[0] || "";
  const years = totalExperienceYears(experience);
  const photo = mediaUrl(profile?.profile_image);

  return (
    <section id="top" className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid-lines" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <SparkleIcon size={15} />
            Hello, I&apos;m
          </p>

          {loading && !profile ? (
            <>
              <Skeleton className="skeleton-line skeleton-title" />
              <Skeleton className="skeleton-line skeleton-subtitle" />
            </>
          ) : (
            <h1 className="hero-title">
              {name}
              <span className="hero-period">.</span>
            </h1>
          )}

          <p className="hero-headline">{headline}</p>

          {bio ? (
            <p className="hero-lead">{bio}</p>
          ) : (
            <p className="hero-lead hero-lead-muted">
              {loading
                ? "Loading profile…"
                : "Add a profile in Django admin to introduce yourself here."}
            </p>
          )}

          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">
              Explore my work
              <ArrowUpRightIcon size={18} />
            </a>
            <a className="btn btn-ghost" href="#contact">
              Get in touch
            </a>
          </div>

          <div className="hero-meta">
            {profile?.location ? (
              <span>
                <MapPinIcon size={16} />
                {profile.location}
              </span>
            ) : null}
            {profile?.email ? (
              <a href={`mailto:${profile.email}`}>
                <MailIcon size={16} />
                {profile.email}
              </a>
            ) : null}
          </div>

          <SocialLinks profile={profile} size={19} showLabels />

          {!loading && !profile && !hasError ? (
            <p className="hero-setup">
              No profile found.{" "}
              <a href={ADMIN_URL} target="_blank" rel="noreferrer">
                Add one in the admin
              </a>{" "}
              to make this page yours.
            </p>
          ) : null}
        </div>

        <div className="hero-visual">
          <div className="portrait-frame">
            <div className="portrait-ring" aria-hidden="true" />
            {photo ? (
              <img
                className="portrait"
                src={photo}
                alt={profile?.name ? `${profile.name} portrait` : "Portrait"}
                loading="eager"
              />
            ) : (
              <div className="portrait portrait-fallback" aria-hidden="true">
                <span>{initials(profile?.name) || "DEV"}</span>
              </div>
            )}
            <div className="floating-card floating-card-top">
              <span className="floating-icon">
                <SparkleIcon size={16} />
              </span>
              <div>
                <strong>{skills.length}</strong>
                <small>skills &amp; tools</small>
              </div>
            </div>
            <div className="floating-card floating-card-bottom">
              <span className="floating-dot" aria-hidden="true" />
              <div>
                <strong>{projects.length}</strong>
                <small>projects shipped</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hero-stats">
          <Stat value={`${projects.length}`} label="Projects showcased" />
          <Stat value={`${skills.length}`} label="Skills in the toolbox" />
          <Stat
            value={years ? `${years}+` : "—"}
            label="Years of experience"
          />
          <Stat value={`${experience.length}`} label="Roles & milestones" />
        </div>
      </div>
    </section>
  );
}
