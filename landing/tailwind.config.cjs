/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./404.html",
    "./founder/index.html",
    "./software-training-bangladesh/index.html",
    "./sme-software-bangladesh/index.html",
    "./orientation-2026/index.html",
    "./open-tech-cooperative-bangladesh/index.html",
    "./public/**/*.js",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      mobile: { max: "767px" }, // Mobile: <768px
      tablet: { min: "768px", max: "1024px" }, // Tablet: 768px - 1024px
      laptop: { min: "1025px", max: "1440px" }, // Laptop: 1025px - 1440px
      desktop: { min: "1441px" }, // Desktop: >1440px
      // Legacy support for common shadcn/ui patterns if needed
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1400px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
        },
        coop: {
          DEFAULT: "hsl(var(--coop))",
          foreground: "hsl(var(--coop-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "Hind Siliguri", "sans-serif"],
        display: ["Inter", "Hind Siliguri", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "text-gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35", filter: "blur(20px)" },
          "50%": { opacity: "0.65", filter: "blur(35px)" },
        },
        "orb-drift": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-15px, 10px) scale(0.97)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(var(--tw-color-primary), 0.3)" },
          "50%": { borderColor: "rgba(var(--tw-color-primary), 0.8)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "text-gradient": "text-gradient 5s ease infinite",
        float: "float 7s ease-in-out infinite",
        "pulse-glow": "pulse-glow 5s ease-in-out infinite",
        "orb-drift": "orb-drift 12s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        marquee: "marquee 20s linear infinite",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
