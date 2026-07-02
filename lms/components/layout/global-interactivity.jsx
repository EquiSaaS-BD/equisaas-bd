"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * GlobalInteractivity handles platform-wide Kinetic Premium effects.
 * It tracks mouse coordinates on the documentElement for --mouse-x/y CSS variables
 * and powers lightweight scroll-reveal for any surface marked with data-reveal.
 */
export function GlobalInteractivity() {
  const pathname = usePathname();

  useEffect(() => {
    const supportsFinePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
    if (!supportsFinePointer) {
      document.documentElement.style.setProperty("--mouse-x", "50%");
      document.documentElement.style.setProperty("--mouse-y", "30%");
      return undefined;
    }

    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const observedNodes = new WeakSet();
    let revealObserver = null;

    const revealNode = (node) => {
      if (!(node instanceof HTMLElement)) return;
      node.classList.add("revealed");
      if (revealObserver) {
        revealObserver.unobserve(node);
      }
    };

    const getRevealNodes = (root) => {
      if (!root) return [];
      if (root instanceof HTMLElement && root.matches?.("[data-reveal]")) {
        return [root, ...root.querySelectorAll("[data-reveal]")];
      }
      if (root instanceof Document || root instanceof DocumentFragment) {
        return Array.from(root.querySelectorAll("[data-reveal]"));
      }
      return [];
    };

    if (reduceMotion) {
      getRevealNodes(document).forEach(revealNode);

      const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            getRevealNodes(node).forEach(revealNode);
          });
        });
      });

      if (document.body) {
        mutationObserver.observe(document.body, { childList: true, subtree: true });
      }

      return () => mutationObserver.disconnect();
    }

    if (typeof IntersectionObserver === "undefined") {
      getRevealNodes(document).forEach(revealNode);
      return undefined;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealNode(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -48px 0px",
      },
    );

    const observeRevealNodes = (root = document) => {
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      getRevealNodes(root).forEach((node) => {
        if (!(node instanceof HTMLElement) || node.classList.contains("revealed") || observedNodes.has(node)) {
          return;
        }

        const rect = node.getBoundingClientRect();
        if (rect.top <= viewportHeight * 0.92) {
          revealNode(node);
          return;
        }

        observedNodes.add(node);
        revealObserver.observe(node);
      });
    };

    observeRevealNodes(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          observeRevealNodes(node);
        });
      });
    });

    if (document.body) {
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    const rafId = window.requestAnimationFrame(() => observeRevealNodes(document));
    const timeoutId = window.setTimeout(() => observeRevealNodes(document), 250);
    const fallbackTimeoutId = window.setTimeout(() => observeRevealNodes(document), 900);
    const sweepIntervalId = window.setInterval(() => observeRevealNodes(document), 650);
    const stopSweepTimeoutId = window.setTimeout(() => window.clearInterval(sweepIntervalId), 5200);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      window.clearTimeout(fallbackTimeoutId);
      window.clearTimeout(stopSweepTimeoutId);
      window.clearInterval(sweepIntervalId);
      mutationObserver.disconnect();
      if (revealObserver) {
        revealObserver.disconnect();
      }
    };
  }, [pathname]);

  return null;
}
