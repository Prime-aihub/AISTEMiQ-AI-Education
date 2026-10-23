
/* =========================================
   AISTEMiQ — Curriculum Page Interactions
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enabled");

  const stages = document.querySelectorAll(".reveal-stage");

  // Reveal age stages as they enter the viewport.
  if ("IntersectionObserver" in window) {
    const stageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    stages.forEach((stage) => stageObserver.observe(stage));
  } else {
    // Fallback for older browsers.
    stages.forEach((stage) => {
      stage.classList.add("is-visible");
    });
  }

  // Respect visitors who prefer reduced motion.
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (reducedMotion.matches) {
    stages.forEach((stage) => {
      stage.classList.add("is-visible");
    });
  }

  console.info("AISTEMiQ curriculum page loaded.");
});
