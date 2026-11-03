import { useEffect, useId, useMemo, useState } from "react";

import { useActiveSection, useScrollLock } from "../hooks/useActiveSection";
import { initials } from "../lib/format";
import { CloseIcon, MenuIcon } from "./Icons";
import SocialLinks from "./SocialLinks";

const BASE_ITEMS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "blog", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ profile, available = {}, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  const items = useMemo(
    () => BASE_ITEMS.filter((item) => available[item.id] !== false),
    [available],
  );
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const active = useActiveSection(ids);

  useScrollLock(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const go = (event, id) => {
    event.preventDefault();
    setOpen(false);
    onNavigate?.(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a
          className="brand"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            setOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="brand-mark" aria-hidden="true">
            {initials(profile?.name) || "DEV"}
          </span>
          <span className="brand-text">
            <strong>{profile?.name || "Portfolio"}</strong>
            <small>{profile?.headline || "Developer"}</small>
          </span>
        </a>

        <nav
          id={menuId}
          className={`nav${open ? " is-open" : ""}`}
          aria-label="Primary"
        >
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? "is-active" : undefined}
                  aria-current={active === item.id ? "location" : undefined}
                  onClick={(event) => go(event, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-footer">
            <SocialLinks profile={profile} size={18} showLabels />
          </div>
        </nav>

        <div className="header-actions">
          <SocialLinks profile={profile} size={18} />
          <a
            className="btn btn-primary btn-small header-cta"
            href="#contact"
            onClick={(event) => go(event, "contact")}
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="icon-btn menu-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      ) : null}
    </header>
  );
}
