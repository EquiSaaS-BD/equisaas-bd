import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import "./Section.module.scss";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const animations = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn
};

export default function Section({
  id,
  className = "",
  children,
  variant = "default",
  padding = "normal",
  animate = true,
  animationType = "fadeInUp",
  delay = 0,
  ...props
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  const getPaddingClass = () => {
    switch (padding) {
      case "none": return "";
      case "sm": return "section-padding-sm";
      case "normal": return "section-padding-normal";
      case "lg": return "section-padding-lg";
      case "xl": return "section-padding-xl";
      default: return "section-padding-normal";
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case "muted": return "section-muted";
      case "card": return "section-card";
      case "gradient": return "section-gradient";
      default: return "";
    }
  };

  const getAnimation = () => {
    switch (animationType) {
      case "fadeInLeft": return fadeInLeft;
      case "fadeInRight": return fadeInRight;
      case "scaleIn": return scaleIn;
      default: return fadeInUp;
    }
  };

  if (!animate || reduceMotion) {
    return (
      <section
        id={id}
        ref={ref}
        className={`section ${getPaddingClass()} ${getVariantClass()} ${className}`}
        {...props}
      >
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      variants={getAnimation()}
      transition={{ delay }}
      className={`section ${getPaddingClass()} ${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
}