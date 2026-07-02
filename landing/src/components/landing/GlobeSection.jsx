import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function GlobeSection({ lang }) {
  const canvasRef = useRef();

  useEffect(() => {
    let phi = 0;
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600,
      height: 600,
      phi: 0,
      theta: 0,
      dark: 1, // Dark mode globe
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.1, 0.1, 0.1],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.1, 0.2, 0.3],
      markers: [
        // Dhaka, Bangladesh
        { location: [23.8103, 90.4125], size: 0.1 },
        // Add more global partners later
        { location: [40.7128, -74.0060], size: 0.05 }, // NY
        { location: [51.5074, -0.1278], size: 0.05 }, // London
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center py-12 relative overflow-hidden h-[400px]">
      <canvas
        ref={canvasRef}
        style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
        className="opacity-90"
      />
    </div>
  );
}
