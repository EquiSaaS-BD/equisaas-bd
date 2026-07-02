import React, { useCallback, useMemo, useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "next-themes";

export default function GlobalParticleEngine() {
  const { resolvedTheme } = useTheme();
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Initial check
    checkWidth();
    
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  
  const particlesInit = useCallback(async (engine) => {
    // load the slim version to reduce bundle size and keep it lightweight
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => {
    const isDark = resolvedTheme === "dark";
    // EquiSaaS Colors: primary (blue), coop (green), cyan
    const colors = isDark 
      ? ["#3b82f6", "#10b981", "#06b6d4"] // Bright versions for dark mode
      : ["#2563eb", "#059669", "#0891b2"]; // Deeper versions for light mode

    return {
      fullScreen: {
        enable: false, // We will manually position it to cover the app
        zIndex: -10,
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.5,
              color: isDark ? "#10b981" : "#059669"
            },
          },
        },
      },
      particles: {
        color: {
          value: colors,
        },
        links: {
          color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 0.6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 60, // Keep number low for performance (Lightweight)
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          }
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    };
  }, [resolvedTheme]);

  return (
    <div className="fixed inset-0 z-[-10] w-full h-full pointer-events-none opacity-80">
      {isDesktop ? (
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={options}
          className="w-full h-full"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-[-1]" />
      )}
      {/* Fallback ambient color wash underneath particles to ensure no blank spaces */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-[-1]" />
    </div>
  );
}
