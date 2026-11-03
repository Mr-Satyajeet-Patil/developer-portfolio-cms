import { useMemo, useState } from "react";

import About from "./components/About";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { ErrorBanner, WarningBanner } from "./components/States";
import ToTop from "./components/ToTop";
import { usePortfolioData } from "./hooks/usePortfolioData";

export default function App() {
  const { data, loading, error, warning, reload } = usePortfolioData();
  const [warningDismissed, setWarningDismissed] = useState(false);

  const { profile, projects, skills, experience, education, posts } = data;

  const retry = () => {
    setWarningDismissed(false);
    reload();
  };

  const available = useMemo(
    () => ({
      about: true,
      projects: true,
      skills: true,
      experience: loading || experience.length > 0,
      education: loading || education.length > 0,
      blog: loading || posts.length > 0,
      contact: true,
    }),
    [loading, experience.length, education.length, posts.length],
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navbar profile={profile} available={available} />

      <main id="main">
        <Hero
          profile={profile}
          projects={projects}
          skills={skills}
          experience={experience}
          loading={loading}
          hasError={Boolean(error)}
        />

        {error || (warning && !warningDismissed) ? (
          <div className="container top-notices">
            {error ? <ErrorBanner message={error} onRetry={retry} /> : null}
            {warning && !warningDismissed ? (
              <WarningBanner
                message={warning}
                onDismiss={() => setWarningDismissed(true)}
              />
            ) : null}
          </div>
        ) : null}

        <About
          profile={profile}
          skills={skills}
          experience={experience}
          loading={loading}
        />
        <Projects projects={projects} loading={loading} />
        <Skills skills={skills} loading={loading} />
        {available.experience ? (
          <Experience experience={experience} loading={loading} />
        ) : null}
        {available.education ? (
          <Education education={education} loading={loading} />
        ) : null}
        {available.blog ? <Blog posts={posts} loading={loading} /> : null}
        <Contact profile={profile} />
      </main>

      <Footer profile={profile} />
      <ToTop />
    </>
  );
}
