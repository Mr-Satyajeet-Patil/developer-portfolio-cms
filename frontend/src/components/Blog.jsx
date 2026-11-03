import { useState } from "react";

import { ADMIN_URL } from "../api/client";
import { formatDate } from "../lib/format";
import BlogModal from "./BlogModal";
import { ArrowUpRightIcon, CalendarIcon } from "./Icons";
import Reveal from "./Reveal";
import Section from "./Section";
import { EmptyNote, SkeletonGrid } from "./States";

export default function Blog({ posts = [], loading }) {
  const [selected, setSelected] = useState(null);

  return (
    <Section
      id="blog"
      eyebrow="Writing"
      title={
        <>
          Notes &amp; <span className="text-gradient">articles</span>
        </>
      }
      lead="Short write-ups about things I build, break and learn."
      action={
        posts.length ? (
          <span className="section-count">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </span>
        ) : null
      }
    >
      {loading && !posts.length ? (
        <SkeletonGrid count={3} rows={3} />
      ) : posts.length ? (
        <div className="grid grid-3">
          {posts.map((post, index) => (
            <Reveal key={post.id} delay={(index % 3) * 70}>
              <button
                type="button"
                className="card blog-card"
                onClick={() => setSelected(post)}
                aria-haspopup="dialog"
              >
                <div className="blog-meta">
                  <span>
                    <CalendarIcon size={14} />
                    {formatDate(post.created_at)}
                  </span>
                  <ArrowUpRightIcon size={16} className="blog-arrow" />
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="blog-read">Read article</span>
              </button>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="card empty-card">
          <EmptyNote>
            Nothing published yet.{" "}
            <a href={ADMIN_URL} target="_blank" rel="noreferrer">
              Write your first post
            </a>{" "}
            in the admin — published posts appear here automatically.
          </EmptyNote>
        </div>
      )}

      <BlogModal post={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
