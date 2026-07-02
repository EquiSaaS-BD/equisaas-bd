import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    document.body.classList.add("cursor-hidden");

    const dot = dotRef.current;
    const ring = ringRef.current;
    let x = 0;
    let y = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId = null;

    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (dot) dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const animate = () => {
      ringX += (x - ringX) * 0.15;
      ringY += (y - ringY) * 0.15;
      if (ring) ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      rafId = requestAnimationFrame(animate);
    };

    const onHover = (event) => {
      const interactive = event.target.closest(
        "a, button, [role=\"button\"], input, select, textarea, label"
      );
      ring?.classList.toggle("is-hover", !!interactive);
    };

    const onDown = () => ring?.classList.add("is-down");
    const onUp = () => ring?.classList.remove("is-down");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onHover);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("cursor-hidden");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onHover);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="premium-cursor-ring" />
      <div ref={dotRef} className="premium-cursor-dot" />
    </>
  );
}
