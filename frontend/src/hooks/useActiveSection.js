import { useEffect, useRef, useState } from "react";

/** Tracks which section is currently in the reading area of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? "");
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      ticking.current = false;
      const marker = window.scrollY + window.innerHeight * 0.35;
      let current = "";

      for (const id of ids) {
        const node = document.getElementById(id);
        if (node && node.offsetTop <= marker) current = id;
      }

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 80
      ) {
        current = ids[ids.length - 1];
      }

      if (current) setActive(current);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}

/** Locks page scroll while a modal is open. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
