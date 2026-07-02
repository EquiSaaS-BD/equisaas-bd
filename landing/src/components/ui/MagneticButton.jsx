import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function MagneticButton({ children, className = "", strength = 20 }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Springs for smooth physics
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate distance from center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate movement limit based on strength
    const moveX = (e.clientX - centerX) * (strength / 100);
    const moveY = (e.clientY - centerY) * (strength / 100);

    x.set(moveX);
    y.set(moveY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{ x, y }}
      className={`inline-block relative ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Inner subtle reverse parallax for text if needed */}
      <motion.div
        style={{ 
          x: useSpring(isHovered ? x.get() * -0.2 : 0, springConfig),
          y: useSpring(isHovered ? y.get() * -0.2 : 0, springConfig)
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
