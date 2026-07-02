"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export function AnimatedBlock({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 30,
  as = "div",
  ...props
}) {
  const Component = motion[as] || motion.div;

  const yOffsets = {
    up: distance,
    down: -distance,
    left: 0,
    right: 0,
    none: 0,
  };

  const xOffsets = {
    up: 0,
    down: 0,
    left: distance,
    right: -distance,
    none: 0,
  };

  return (
    <Component
      initial={{ opacity: 0, y: yOffsets[direction], x: xOffsets[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ ...SPRING_TRANSITION, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function AnimatedScale({
  children,
  className,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ ...SPRING_TRANSITION, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
