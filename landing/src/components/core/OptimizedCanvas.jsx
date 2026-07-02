import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";

export function OptimizedCanvas({ children, className, camera }) {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: "200px 0px 200px 0px" } // Render slightly before scrolling into view
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {inView ? (
        <Canvas 
          camera={camera} 
          dpr={[1, 1.5]} // Performance optimization: Cap DPR for high-density mobile screens
          gl={{ powerPreference: "high-performance", antialias: false }} // Reduce anti-aliasing overhead for raw speed
        >
          {children}
        </Canvas>
      ) : null}
    </div>
  );
}
