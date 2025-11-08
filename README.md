[![Netlify Status](https://api.netlify.com/api/v1/badges/96a4c9bf-b432-4598-a77c-a206b19c3e35/deploy-status)](https://app.netlify.com/projects/joshcyril/deploys)

# Portfolio

A modern, responsive portfolio built with Next.js, TypeScript, and Tailwind CSS. Showcases projects, CV, and interactive sections with a clean UI.

## Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation.
- **TypeScript**: Type-safe development for scalable and maintainable code.
- **Tailwind CSS**: Utility-first CSS for rapid UI development and custom theming.
- **Radix UI**: Accessible UI primitives for dialogs, dropdowns, tooltips, and more.
- **Sanity**: Headless CMS integration for dynamic content management.
- **Chart.js & react-chartjs-2**: Data visualization for project stats and graphs.
- **Embla Carousel**: Smooth, customizable carousel for project showcases.
- **Next Themes**: Dark/light mode support.
- **Lucide React**: Icon library for crisp, customizable icons.
- **GSAP**: Professional animation library for scroll-triggered animations and smooth transitions.

## Features

### Core Features
- Project cards and detail pages
- CV section
- About and main sections
- Responsive navigation and footer
- Theme toggle (dark/light)
- Data-driven charts and graphs
- Modular component structure

### ✨ GSAP Animations & Micro-Interactions

#### Scroll Animations
- **Scroll Progress Indicator**: Visual progress bar at the top of the page
- **Scroll-Triggered Reveals**: Section titles and content fade-up on scroll
- **Smooth Scroll-to-Section**: Smooth scrolling navigation with GSAP

#### Hero Section
- Avatar scale-in animation
- Staggered text reveals
- Social links with stagger effect
- Location badge fade-in

#### Project Cards
- Staggered fade-up animations on load
- **3D tilt effect** on hover (GSAP-powered)
- **Image parallax** on hover
- **Ripple effects** on button clicks
- Smooth hover transitions

#### Navigation
- Slide-in animation on page load
- Auto-hide on scroll down, show on scroll up
- Smooth scroll to top functionality
- Animated theme toggle with rotation

#### About Section
- Content block fade-ins
- Staggered skill tag animations
- Graph chart reveal animations
- Smooth section transitions

#### Experience Section
- Staggered animations for experience cards
- Education cards with fade-up
- Expertise items with sequential reveals

#### Footer
- Fade-in animation on scroll

#### Micro-Interactions
- **Button Ripple Effects**: Material Design-inspired ripple on click
- **Magnetic Buttons**: Subtle pull effect on hover (optional)
- **Theme Toggle Animation**: Smooth rotation on theme change
- **Smooth Page Transitions**: Fade transitions between routes (optional)

#### Performance & Accessibility
- **GPU Acceleration**: All animations use transform/opacity
- **Will-Change Optimization**: Dynamic will-change management
- **Reduced Motion Support**: Full `prefers-reduced-motion` compliance
- **60fps Animations**: Optimized for smooth performance
- **Lazy Loading**: Animations only trigger when in viewport

## 🎨 Animation Details

All animations are built with GSAP and ScrollTrigger for smooth, performant experiences:
- **Performance Optimized**: Uses transform and opacity for GPU acceleration
- **Accessible**: Respects user preferences for reduced motion
- **Responsive**: Animations work seamlessly across all device sizes
- **Smooth**: 60fps animations with proper easing functions

## 🚀 Optional Future Enhancements

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed roadmap including:
- Loading screen animations (component created, ready to use)
- Advanced parallax effects
- Custom cursor effects (optional)
- Scroll-triggered pinning for sections
- Split text animations for headings

## Folder Structure

- `app/` – Main application, pages, and components
  - `components/` – UI components and sections
    - `animations/` – Reusable animation components (ScrollProgress, AnimateOnScroll)
    - `sections/` – Page sections (Main, About, Projects, E3)
  - `lib/` – Utility functions, CMS integration, and animation helpers
- `components/` – Shared UI components (buttons, cards, etc.)
- `public/` – Static assets (SVGs, icons)
- `tailwind.config.ts` – Tailwind CSS configuration

## Animation Architecture

The animation system is built with a modular, performant approach:

### Core Utilities
- **`app/lib/animations.ts`**: Core animation utility functions (fadeIn, fadeUp, stagger, etc.)
- **`app/lib/animations-context.tsx`**: Animation context provider for GSAP instance management
- **`app/lib/smooth-scroll.ts`**: Smooth scrolling utilities with GSAP
- **`app/lib/button-effects.tsx`**: Button micro-interactions (ripple, magnetic)
- **`app/lib/performance.ts`**: Performance optimization utilities

### Component Structure
- **Animated Components**: Each section has an `*Animated.tsx` client component wrapper
- **Server/Client Separation**: Server components fetch data, client components handle animations
- **Reusable Components**:
  - `ScrollProgress`: Scroll progress indicator
  - `AnimateOnScroll`: Wrapper for scroll-triggered animations
  - `ButtonWithEffects`: Enhanced button with ripple and magnetic effects
  - `PageTransition`: Smooth page transitions (optional)
  - `LoadingScreen`: Loading screen with animations (optional)

### Performance Features
- **Will-Change Management**: Automatic will-change optimization
- **GPU Acceleration**: Transform and opacity only
- **Lazy Loading**: Animations trigger on viewport entry
- **Debounce/Throttle**: Optimized event handlers
- **Reduced Motion**: Full accessibility support

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup

Create a `.env.local` file with your Sanity configuration:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Performance

- **Lighthouse Score**: Optimized for 90+ performance score
- **Animation Performance**: 60fps animations using GPU acceleration
- **Bundle Size**: Optimized with code splitting and lazy loading
- **Accessibility**: WCAG 2.1 AA compliant with reduced motion support

## Credits

Built and maintained by [Josh Cyril](https://github.com/JoshCyril).

## License

This project is open source and available under the [MIT License](LICENSE).
