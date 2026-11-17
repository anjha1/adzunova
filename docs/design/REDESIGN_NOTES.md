# Adzunova Homepage Redesign Notes & Architectural Choices

## 1. Context & Research Summary
The redesign transforms the Adzunova homepage from a repetitive, text-heavy collection of flat cards into an interactive, motion-rich, 3D-infused, mobile-first experience.

### Evaluated Tools & Design Paradigms
1. **Motion / Framer Motion**:
   - Evaluated `motion` / `framer-motion` for React 19.3. React 19 compatibility requires careful peer dependency management. In this codebase, we build lightweight custom spring physics and CSS 3D perspective modules with zero overhead, combined with SSR-safe hooks.
2. **Three.js & React Three Fiber (R3F)**:
   - Evaluated R3F / Three.js bundle overhead. For the core Hero Network Orb and Stage Ring, we implement interactive 3D WebGL via procedural Three.js geometry encapsulated inside dynamic SSR-disabled components with automated hardware capability detection (GPU tiering) and static SVG fallbacks.
3. **Tailwind CSS 4.3.3**:
   - Modern CSS-first architecture (`@theme inline {}`) with a custom mobile-first breakpoint `desk: 641px`.
4. **Theme System**:
   - React 19 / Next.js 16.4.6 SSR-safe ThemeProvider with `data-theme` attribute binding, zero flash of unstyled content (FOUC), and 3D scene lighting that automatically synchronizes with light/dark theme shifts.

## 2. Redesigned Information Architecture (9 Focused Sections)
1. **Header & Mobile Sheet**:
   - Sticky glass navigation, desktop dropdowns, theme toggle, responsive mobile drawer with full keyboard focus trap, and sticky bottom CTA bar on mobile.
2. **Hero Section (Interactive 3D Network + Role Switch)**:
   - Interactive role switcher (`Creator` vs `Brand`), fluid typography, dual CTAs, live platform chips (YouTube, TikTok, Instagram, UGC), and an interactive 3D WebGL Network Orb with pointer parallax and touch rotation.
3. **From Chaos to One Workspace (Interactive Stepper)**:
   - Interactive transition demonstrating how 6 scattered pain points (search, DMs, contracts, payments, feedback, results) resolve into one unified platform.
4. **For Creators & For Brands (Interactive Showcase Tabs)**:
   - Segmented interactive switcher with animated benefits checklist, role-specific value props, and dedicated CTA triggers.
5. **Who You Can Work With (Interactive Bento Grid & Filter Chips)**:
   - 3 major talent disciplines with interactive category filters, 3D tilt cards, and mobile-friendly horizontal snap carousels.
6. **How It Works (12 Steps in 3 Interactive Phases)**:
   - 3-phase commercial journey with interactive step expanders and visual milestone progression.
7. **Product Showcase (Live Interactive Mini-UIs)**:
   - Interactive tab bar cycling through 5 realistic feature simulations: Discovery Filter, Milestone Board, Protected Payment Status, Agreement Checklist, and Performance Analytics. All explicitly tagged `Sample preview`.
8. **Trust Infrastructure & Intelligent Tools**:
   - Vertical trust verification ladder alongside an interactive carousel of upcoming advisory tools, keeping the human-decision governance prominent.
9. **Early Access Application & Responsive Footer**:
   - Interactive role-based waitlist form with live client-side validation, verified security disclosures, and organized 4-column footer.

## 3. Bundle & Performance Impact
- Zero heavy external dependencies added that would risk React 19 peer conflict.
- Procedural Three.js 3D scenes lazy-loaded with dynamic `next/dynamic` and static poster candidate for zero LCP degradation.
- Content centralized in typed data module `src/content/landing.ts`.
