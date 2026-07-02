import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function NetworkParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const numParticles = window.innerWidth > 1024 ? 80 : window.innerWidth > 768 ? 50 : 30;
    const connectionDistance = 150;
    
    let mouse = { x: null, y: null };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        // Interactive mouse repel
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            const force = (120 - distance) / 120;
            this.vx -= (dx / distance) * force * 0.05;
            this.vy -= (dy / distance) * force * 0.05;
          }
        }
        
        // Speed limit
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 1.5) {
          this.vx = (this.vx / speed) * 1.5;
          this.vy = (this.vy / speed) * 1.5;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(13, 118, 110, 0.4)"; // brand primary tone
        ctx.fill();
      }
    }

    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.15})`; // coop green tone
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60 dark:opacity-40" />;
}

export default function AmbientBackdrop() {
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-background">
      {/* 1. Base Gradient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10 transform-gpu" />
      
      {/* 2. Interactive Canvas Particles (Hidden on very small screens for performance) */}
      <div className="hidden sm:block absolute inset-0 mix-blend-screen dark:mix-blend-lighten transform-gpu">
        <NetworkParticles />
      </div>

      {/* 3. Smooth Grid Overlay */}
      <div className="absolute inset-0 grid-bg-modern opacity-60 dark:opacity-30 transform-gpu" />

      {/* 4. Animated Glowing Orbs using CSS (Hardware Accelerated) */}
      {/* Top Left Orb */}
      <div 
        className="absolute -left-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-[100px] animate-pulse-glow transform-gpu will-change-transform" 
      />
      
      {/* Center Right Orb */}
      <div 
        className="absolute -right-32 top-1/4 h-[40rem] w-[40rem] rounded-full bg-coop/10 blur-[120px] animate-float transform-gpu will-change-transform" 
      />
      
      {/* Bottom Center Orb */}
      <div 
        className="absolute -bottom-40 left-1/4 h-[30rem] w-[50rem] rounded-full bg-cyan-500/10 blur-[100px] transform-gpu will-change-transform" 
      />
    </div>
  );
}
