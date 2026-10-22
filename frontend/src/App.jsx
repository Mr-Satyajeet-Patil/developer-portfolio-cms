import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api";


function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  subject: "",
  message: "",
});
const [experience, setExperience] = useState([]);
const [education, setEducation] = useState([]);
const [posts, setPosts] = useState([]);
const [skills, setSkills] = useState([]);

const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    Promise.all([
  fetch(`${API_URL}/profile/`).then((res) => res.json()),
  fetch(`${API_URL}/projects/`).then((res) => res.json()),
  fetch(`${API_URL}/skills/`).then((res) => res.json()),
  fetch(`${API_URL}/experience/`).then((res) => res.json()),
  fetch(`${API_URL}/education/`).then((res) => res.json()),
  fetch(`${API_URL}/blog/`).then((res) => res.json()),
])
  .then(
    ([
      profileData,
      projectsData,
      skillsData,
      experienceData,
      educationData,
      postsData,
    ]) => {
      setProfile(profileData[0] || null);
      setProjects(projectsData);
      setSkills(skillsData);
      setExperience(experienceData);
      setEducation(educationData);
      setPosts(postsData);
    }
  )
  .catch((error) => {
    console.error("API error:", error);
  })
  .finally(() => {
    setLoading(false);
  });
  }, []);

  if (loading) {
    return <div className="loading">Loading portfolio...</div>;
  }

  const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleSubmit = async (event) => {
  event.preventDefault();

  setFormStatus("Sending...");

  try {
    const response = await fetch(`${API_URL}/contact/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    setFormStatus(data.message);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error(error);
    setFormStatus("Something went wrong. Please try again.");
  }
};

  return (
    <>
      <nav className="navbar">
        <div className="container nav-content">
          <a href="#home" className="logo">
            {profile?.name || "Portfolio"}
          </a>

          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#education">Education</a>
            <a href="#blog">Blog</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      <main>
        <section id="home" className="hero-section">
          <div className="container hero-content">
            <div>
              <p className="eyebrow">Hello, I'm</p>

              <h1>{profile?.name || "Satyajeet Patil"}</h1>

              <h2>
                {profile?.headline ||
                  "Python Django Full Stack Developer"}
              </h2>

              <p className="hero-bio">
                {profile?.bio ||
                  "I build modern web applications using Python, Django, React and databases."}
              </p>

              <div className="hero-buttons">
                <a href="#projects" className="button primary">
                  View Projects
                </a>
                <div className="social-links">
                 {profile?.github_url && (
                <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                  GitHub
                </a>
  )}

  {profile?.linkedin_url && (
    <a
      href={profile.linkedin_url}
      target="_blank"
      rel="noreferrer"
    >
      LinkedIn
    </a>
  )}
</div>
                <a href="#contact" className="button secondary">
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <p className="eyebrow">About Me</p>

            <h2>Building useful things with code.</h2>

            <p className="section-text">
              I'm a Python and Django developer focused on building
              reliable, database-driven web applications with clean
              frontend experiences.
            </p>

            {profile?.location && (
              <p>
                <strong>Location:</strong> {profile.location}
              </p>
            )}
          </div>
        </section>

        <section id="skills" className="section muted">
          <div className="container">
            <p className="eyebrow">Skills</p>

            <h2>Technologies I work with</h2>

            {skills.length > 0 ? (
  skills.map((skill) => (
    <div className="skill-card" key={skill.id}>
      <h3>{skill.name}</h3>

      {skill.category && (
        <p>{skill.category}</p>
      )}

      <div className="skill-level">
        <div
          className="skill-level-bar"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  ))
) : (
  <p>No skills added yet.</p>
)}
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container">
            <p className="eyebrow">Projects</p>

            <h2>Things I've built</h2>

            <div className="projects-grid">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <article
                    className="project-card"
                    key={project.id}
                  >
                    <div className="project-content">
                      <h3>{project.title}</h3>

                      <p>{project.description}</p>

                      {project.technologies && (
                        <p className="technology">
                          {project.technologies}
                        </p>
                      )}

                      <div className="project-links">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="button secondary"
                          >
                            GitHub
                          </a>
                        )}

                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noreferrer"
                            className="button primary"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <p>
                  Projects will appear here once added through Django
                  Admin.
                </p>
              )}
            </div>
          </div>
        </section>

       <section id="experience" className="section muted">
  <div className="container">
    <p className="eyebrow">Experience</p>

    <h2>My professional journey</h2>

    <div className="timeline">
      {experience.length > 0 ? (
        experience.map((item) => (
          <div className="timeline-item" key={item.id}>
            <h3>{item.role}</h3>

            <h4>{item.company}</h4>

            <p className="timeline-date">
              {item.start_date} —{" "}
              {item.current ? "Present" : item.end_date}
            </p>

            <p>{item.description}</p>
          </div>
        ))
      ) : (
        <p>No experience added yet.</p>
      )}
    </div>
  </div>
</section>

       <section id="education" className="section">
  <div className="container">
    <p className="eyebrow">Education</p>

    <h2>Academic background</h2>

    <div className="education-grid">
      {education.length > 0 ? (
        education.map((item) => (
          <div className="education-card" key={item.id}>
            <h3>{item.degree}</h3>

            <h4>{item.institution}</h4>

            <p className="education-years">
              {item.start_year} —{" "}
              {item.end_year || "Present"}
            </p>

            {item.description && (
              <p>{item.description}</p>
            )}
          </div>
        ))
      ) : (
        <p>No education added yet.</p>
      )}
    </div>
  </div>
</section>

       <section id="blog" className="section muted">
  <div className="container">
    <p className="eyebrow">Blog</p>

    <h2>Thoughts & learning</h2>

    <div className="blog-grid">
      {posts.length > 0 ? (
        posts.map((post) => (
          <article className="blog-card" key={post.id}>
            <h3>{post.title}</h3>

            <p>{post.excerpt}</p>

            <span className="blog-date">
              {new Date(post.created_at).toLocaleDateString()}
            </span>

            <span className="blog-link"> Read more → </span>
          </article>
        ))
      ) : (
        <p>
          Articles about Python, Django, React, APIs and full-stack
          development will appear here.
        </p>
      )}
    </div>
  </div>
</section>

        <section id="contact" className="section contact-section">
  <div className="container">
    <p className="eyebrow">Contact</p>

    <h2>Let's build something.</h2>

    <p>
      Have a project, opportunity or idea? Feel free to reach out.
    </p>

    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Your email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
        required
      />

      <textarea
        name="message"
        placeholder="Your message"
        rows="6"
        value={formData.message}
        onChange={handleChange}
        required
      />

      <button type="submit" className="button primary">
        Send Message
      </button>

      {formStatus && <p>{formStatus}</p>}
    </form>
  </div>
</section>
      </main>

      <footer>
  <div className="container">
    <p>
      © {new Date().getFullYear()}{" "}
      {profile?.name || "Satyajeet Patil"}.
      Built with React + Django.
    </p>

    <div className="footer-links">
      {profile?.github_url && (
        <a
          href={profile.github_url}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      )}

      {profile?.linkedin_url && (
        <a
          href={profile.linkedin_url}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      )}
    </div>
  </div>
</footer>
    </>
  );
}

export default App;