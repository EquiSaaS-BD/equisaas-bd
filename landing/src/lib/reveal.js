/**
 * Simple intersection observer to handle [data-reveal] animations
 */
export function initReveal() {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          // Once revealed, we can stop observing this element
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px", // Trigger slightly before it enters fully
    }
  );

  const elements = document.querySelectorAll("[data-reveal]");
  elements.forEach((el) => observer.observe(el));
}
