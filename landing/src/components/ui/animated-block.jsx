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

  const variants = {
    hidden: { opacity: 0, y: yOffsets[direction], x: xOffsets[direction] },
    visible: { opacity: 1, y: 0, x: 0, transition: { ...SPRING_TRANSITION, delay } }
  };

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={variants}
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
