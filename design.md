# Design Improvement & Roadmap: Farros.co

This document outlines the strategic design and technical improvements for the Farros portfolio, focusing on professional cybersecurity aesthetics, accessibility, and high-performance architecture.

## 1. Visual Identity & Aesthetic Strategy
The current "Glassmorphism" aesthetic is effective but can be deepened to align more with the **Cybersecurity & Data Engineering** niche.

### Proposed Visual Refinements
- **Color Palette Elevation**: 
  - Enhance the `primary` (blue) with subtle glow effects on interactive elements.
  - Introduce a secondary "Warning/Alert" accent (amber/orange) for specific security-related highlights.
- **Micro-interactions**:
  - Add "Terminal-style" typing effects for specific headers.
  - Implement a more sophisticated scan-line effect on project cards.
  - Add hover-triggered background patterns for glass cards.

## 2. Technical Roadmap

### Phase 1: Core UX & Interactivity (Priority)
- **Dark Mode Implementation**: 
  - Refine the existing `ThemeToggle` logic in `Header.astro`.
  - Ensure persistence in `localStorage` and flicker-free loading in `BaseLayout`.
- **Mobile Navigation Logic**:
  - **Redesign**: Transition from the inline block menu to a premium, full-screen overlay.
  - Add smooth CSS transitions and ensure the background is appropriately blurred.
- **Layout Refinements**:
  - Implement a 2-column grid for social/contact cards on mobile to improve scannability.
- **Scroll Reveal System**:
  - Implement a lightweight `IntersectionObserver` script to trigger `.animate` classes as components enter the viewport (Vanilla JS only, keeping the bundle small).

### Phase 2: Architecture & Scalability
- **Atomic Components**:
  - `Button.astro`: Standardize the primary/secondary/ghost variants.
  - `SectionHeader.astro`: Unify the "Title + Italic Span + Description" pattern used in Projects/About.
  - `Card.astro`: Create a reusable glass card wrapper with built-in hover effects.
- **Type Safety**:
  - Move project and experience data to a centralized `src/data/` directory with TypeScript interfaces.

### Phase 3: Performance & SEO
- **Asset Optimization**:
  - Implement `astro:assets` for any images (e.g., project screenshots).
  - Fine-tune font loading to prevent Layout Shift (CLS).
- **SEO & Social**:
  - Complete OpenGraph (OG) tags in `BaseLayout`.
  - Add JSON-LD schema for "Professional Service" or "Person".

## 3. Implementation Plan (Next Steps)

1.  **Task 1**: Remove GSAP (completed) and revert to native CSS/JS.
2.  **Task 2**: Redesign the mobile navigation into a full-screen overlay in `Header.astro`.
3.  **Task 3**: Refine the Theme Toggle and ensure it satisfies Playwright tests.
4.  **Task 4**: Implement the Scroll-Reveal observer.

---
*Status: Execution Phase*  
*Last Updated: May 2026*
