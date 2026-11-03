import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "../api/client";
import {
  educationSchema,
  experienceSchema,
  parseList,
  postSchema,
  profileSchema,
  projectSchema,
  skillSchema,
} from "../api/schemas";

const EMPTY_DATA = {
  profile: null,
  projects: [],
  skills: [],
  experience: [],
  education: [],
  posts: [],
};

const SECTIONS = [
  { key: "profile", label: "profile", path: "/profile/", schema: profileSchema },
  { key: "projects", label: "projects", path: "/projects/", schema: projectSchema },
  { key: "skills", label: "skills", path: "/skills/", schema: skillSchema },
  {
    key: "experience",
    label: "experience",
    path: "/experience/",
    schema: experienceSchema,
  },
  {
    key: "education",
    label: "education",
    path: "/education/",
    schema: educationSchema,
  },
  { key: "posts", label: "writing", path: "/blog/", schema: postSchema },
];

export function usePortfolioData() {
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const controller = useRef(null);

  const load = useCallback(async () => {
    controller.current?.abort();
    const nextController = new AbortController();
    controller.current = nextController;

    setLoading(true);
    setError(null);
    setWarning(null);

    const results = await Promise.allSettled(
      SECTIONS.map(({ path }) => api.get(path, nextController.signal)),
    );

    if (nextController.signal.aborted) return;

    const next = { ...EMPTY_DATA };
    const failed = [];

    results.forEach((result, index) => {
      const section = SECTIONS[index];
      if (result.status === "rejected") {
        failed.push(section.label);
        return;
      }
      const rows = parseList(result.value, section.schema);
      next[section.key] = section.key === "profile" ? (rows[0] ?? null) : rows;
    });

    setData(next);
    setLoading(false);
    setLastUpdated(new Date());

    if (failed.length === SECTIONS.length) {
      setError(
        results[0]?.status === "rejected"
          ? results[0].reason?.message
          : "The portfolio API is unavailable.",
      );
    } else if (failed.length) {
      setWarning(
        `Some sections could not be loaded (${failed.join(", ")}). Showing the rest.`,
      );
    }
  }, []);

  useEffect(() => {
    // Fetching on mount is the point of this effect; the request descendants
    // update state asynchronously once they settle.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    return () => controller.current?.abort();
  }, [load]);

  return { data, loading, error, warning, lastUpdated, reload: load };
}
