import { useState } from "react";

import { api } from "../api/client";
import { contactFormSchema, fieldErrors } from "../api/schemas";
import {
  CheckIcon,
  MailIcon,
  MapPinIcon,
  SendIcon,
  AlertIcon,
} from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";
import SocialLinks from "./SocialLinks";

const EMPTY = { name: "", email: "", subject: "", message: "" };

const serverFieldErrors = (details) => {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return {};
  }
  const result = {};
  for (const [key, value] of Object.entries(details)) {
    const message = Array.isArray(value) ? value[0] : value;
    if (typeof message === "string" && key in EMPTY) result[key] = message;
  }
  return result;
};

export default function Contact({ profile }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (status === "error") {
      setStatus("idle");
      setServerError("");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    const parsed = contactFormSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    setErrors({});
    setServerError("");

    try {
      await api.post("/contact/", parsed.data);
      setStatus("success");
      setValues(EMPTY);
    } catch (error) {
      setStatus("error");
      const details = serverFieldErrors(error.details);
      if (Object.keys(details).length) {
        setErrors(details);
        setServerError("Please fix the highlighted fields.");
      } else {
        setServerError(error.message || "Something went wrong. Try again.");
      }
    }
  };

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title={
        <>
          Let&apos;s build <span className="text-gradient">something</span>
        </>
      }
      lead="Have a project, a role or an idea worth talking about? Send a note — it goes straight to my inbox."
    >
      <div className="contact-grid">
        <Reveal className="card contact-form-card">
          {status === "success" ? (
            <div className="form-success" role="status">
              <span className="success-icon">
                <CheckIcon size={26} />
              </span>
              <h3>Message sent</h3>
              <p>
                Thanks for reaching out. I&apos;ll get back to you as soon as I
                can.
              </p>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                onClick={() => setStatus("idle")}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={update}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name ? (
                    <p className="field-error" id="contact-name-error">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={update}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                  />
                  {errors.email ? (
                    <p className="field-error" id="contact-email-error">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="field">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="What is this about?"
                  value={values.subject}
                  onChange={update}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={
                    errors.subject ? "contact-subject-error" : undefined
                  }
                />
                {errors.subject ? (
                  <p className="field-error" id="contact-subject-error">
                    {errors.subject}
                  </p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows="6"
                  placeholder="A little context about the project, timeline or role…"
                  value={values.message}
                  onChange={update}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                />
                {errors.message ? (
                  <p className="field-error" id="contact-message-error">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {status === "error" && serverError ? (
                <p className="form-error" role="alert">
                  <AlertIcon size={17} />
                  {serverError}
                </p>
              ) : null}

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <SendIcon size={17} />
                    </>
                  )}
                </button>
                <span className="form-hint">
                  {values.message.length}/5000 characters
                </span>
              </div>
            </form>
          )}
        </Reveal>

        <Reveal className="contact-side" delay={120}>
          <div className="card contact-info">
            <h3>Other ways to reach me</h3>
            <ul>
              {profile?.email ? (
                <li>
                  <span className="fact-icon">
                    <MailIcon size={17} />
                  </span>
                  <div>
                    <small>Email</small>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </div>
                </li>
              ) : null}
              {profile?.location ? (
                <li>
                  <span className="fact-icon">
                    <MapPinIcon size={17} />
                  </span>
                  <div>
                    <small>Location</small>
                    <strong>{profile.location}</strong>
                  </div>
                </li>
              ) : null}
            </ul>
            <SocialLinks profile={profile} size={18} showLabels />
          </div>

          <div className="card contact-note">
            <p>
              This form saves your message in the portfolio&apos;s own database,
              so nothing gets lost between inboxes.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
