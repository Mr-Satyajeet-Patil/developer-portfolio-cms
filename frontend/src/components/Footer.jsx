import { ADMIN_URL } from "../api/client";
import { initials } from "../lib/format";
import { ArrowUpRightIcon } from "./Icons";
import SocialLinks from "./SocialLinks";

const LINKS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "blog", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export default function Footer({ profile }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true">
            {initials(profile?.name) || "DEV"}
          </span>
          <div>
            <strong>{profile?.name || "Developer Portfolio"}</strong>
            <p>{profile?.headline || "Designing and building for the web."}</p>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer">
          {LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`}>
              {link.label}
            </a>
          ))}
        </nav>

        <SocialLinks profile={profile} size={18} />
      </div>

      <div className="container footer-bottom">
        <p>
          © {year} {profile?.name || "Portfolio"}. Built with Django &amp;
          React.
        </p>
        <a
          className="footer-admin"
          href={ADMIN_URL}
          target="_blank"
          rel="noreferrer"
        >
          Manage content
          <ArrowUpRightIcon size={14} />
        </a>
      </div>
    </footer>
  );
}
