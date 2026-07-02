# EquiSaaS BD Interactivity & Premium Design System Prompt

This document serves as a specialized prompt for AI coding assistants and developers to maintain, research, and extend the interactivity of the EquiSaaS BD platform.

## Design Philosophy

The EquiSaaS design language is **"Kinetic Premium"**:
- **Tactile**: Interactive elements should respond to user input (mouse move, scroll, click) with natural physics (springs, eases).
- **Glassmorphic**: Use backdrop blurs, subtle borders (`border/70`), and shadows to create depth.
- **Micro-focused**: Large animations are avoided in favor of high-quality micro-interactions (magnetic lift, cursor glows).

## Interactivity Engine Core

### 1. Global Observer (`static-page-shell.js`)
All static pages use a lightweight Intersection Observer to trigger scroll-based reveals.
- **Activation**: Add `data-reveal="direction"` to any element.
- **Directions**: `up`, `left`, `right`, `fade`.
- **Logic**: The observer adds the `.revealed` class when 15% of the element is visible.

### 2. Mouse Tracking Utilities
The global shell tracks mouse coordinates onto CSS variables:
- `--mouse-x`
- `--mouse-y`
These are used forcursor-following "Glow" effects on cards.

## CSS Utility Classes (`index.css`)

### `.glass-premium`
Standard glassmorphism container.
- Backdrop blur: `12px`
- Border: `1px solid hsl(var(--border) / 0.7)`
- Shadow: Deep, spread shadows for surface lift.

### `.hover-lift`
3D translation on hover.
- Desktop: `translateY(-8px)` with subtle rotate.
- Mobile: Slightly reduced effect to avoid layout shifts.

### `.hover-glow`
Mouse-responsive radial gradient.
- Uses `--mouse-x` and `--mouse-y` via local inline styles or global tracking.
- Provides a "flashlight" feel on premium cards.

## Hero Section Principles (`Hero.jsx`)
- **Framer Motion**: Use spring physics (`damping: 20`, `stiffness: 100`) for all stat cards.
- **Fluid Typography**: Headings must use `clamp(min, preferred, max)` to ensure impact across all viewports.
- **Mesh Backgrounds**: Use animated gradients with low opacity to provide motion without distracting from content.

## Maintenance Guidelines
- **Always Build First**: Run `npm run build` before deployment to trigger the MPA assembly script.
- **Preserve SEO**: Ensure `data-reveal` doesn't hide content from crawlers (ensure a reasonable fallback/opacity).
- **Role-Based Clarity**: Animations in the LMS should be faster and more functional than the landing page to preserve productivity.
