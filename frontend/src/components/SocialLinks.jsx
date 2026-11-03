import { GithubIcon, LinkedinIcon, MailIcon } from "./Icons";

export default function SocialLinks({ profile, size = 20, showLabels = false }) {
  const links = [
    profile?.github_url && {
      href: profile.github_url,
      label: "GitHub",
      icon: <GithubIcon size={size} />,
    },
    profile?.linkedin_url && {
      href: profile.linkedin_url,
      label: "LinkedIn",
      icon: <LinkedinIcon size={size} />,
    },
    profile?.email && {
      href: `mailto:${profile.email}`,
      label: "Email",
      icon: <MailIcon size={size} />,
      external: false,
    },
  ].filter(Boolean);

  if (!links.length) return null;

  return (
    <div className="social-links">
      {links.map((link) => (
        <a
          key={link.label}
          className="social-link"
          href={link.href}
          aria-label={link.label}
          title={link.label}
          {...(link.external === false
            ? {}
            : { target: "_blank", rel: "noreferrer noopener" })}
        >
          {link.icon}
          {showLabels ? <span>{link.label}</span> : null}
        </a>
      ))}
    </div>
  );
}
