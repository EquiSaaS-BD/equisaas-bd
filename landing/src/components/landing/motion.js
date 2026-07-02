const springConfig = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      ...springConfig,
      delay: i * 0.1,
    },
  }),
};

export const kineticReveal = (direction = "up", distance = 28, delay = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? distance : direction === "down" ? -distance : 0,
    x: direction === "left" ? distance : direction === "right" ? -distance : 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      ...springConfig,
      delay,
    },
  },
});

