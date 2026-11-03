import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useScrollLock } from "../hooks/useActiveSection";
import { formatDate, paragraphs } from "../lib/format";
import { CalendarIcon, CloseIcon, ClockIcon } from "./Icons";

const readingMinutes = (text) =>
  Math.max(1, Math.round(String(text || "").split(/\s+/).length / 200));

export default function BlogModal({ post, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useScrollLock(Boolean(post));

  useEffect(() => {
    if (!post) return;

    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [post, onClose]);

  if (!post) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-modal-title"
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div className="modal-meta">
            <span>
              <CalendarIcon size={15} />
              {formatDate(post.created_at)}
            </span>
            <span>
              <ClockIcon size={15} />
              {readingMinutes(post.content)} min read
            </span>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close article"
            onClick={onClose}
            ref={closeRef}
          >
            <CloseIcon />
          </button>
        </div>

        <h2 id="blog-modal-title">{post.title}</h2>
        {post.excerpt ? <p className="modal-excerpt">{post.excerpt}</p> : null}

        <div className="modal-content">
          {paragraphs(post.content).length ? (
            paragraphs(post.content).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))
          ) : (
            <p>This article has no content yet.</p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
