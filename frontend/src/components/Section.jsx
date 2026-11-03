import Reveal from "./Reveal";

export default function Section({
  id,
  eyebrow,
  title,
  lead,
  action,
  className = "",
  children,
}) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 className="section-title">{title}</h2>
            {lead ? <p className="section-lead">{lead}</p> : null}
          </div>
          {action ? <div className="section-action">{action}</div> : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
