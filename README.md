[![Netlify Status](https://api.netlify.com/api/v1/badges/96a4c9bf-b432-4598-a77c-a206b19c3e35/deploy-status)](https://app.netlify.com/projects/joshcyril/deploys)

# Portfolio

An interactive storytelling space for my work. Built with cinematic motion, data-informed storytelling, and a CMS-powered pipeline, it showcases high-impact projects, experience, and craft in a single scroll.

## Snapshot

- **Motion-first hero**: Split-text reveals, avatar choreography, and a responsive theme toggle anchor the landing experience.
- **Project vault**: Filterable, GSAP-enhanced cards that animate on scroll and respond to hover with tilt, parallax, and ripple effects.
- **Insightful visuals**: Chart.js dashboards and a force-directed skills graph translate data into narrative.
- **Living CV**: Embedded PDF viewer, micro-interactions, and downloadable assets keep hiring conversations frictionless.

## Experience Flow

### Hero & Navigation
- GSAP-sequenced greetings, location badge, and actionable CTAs.
- Auto-hiding navigation with scroll-aware progress indicator and animated theme toggle.

### Project Vault
- Server-rendered data from Sanity, enriched client-side with advanced filtering, searching, and featured sorting.
- Dynamic “load more” leverages streaming data, skeleton states, and abortable fetches for responsiveness.
- Detail pages mix portable text case studies, lightbox galleries, and structured link tables.

### CV Studio
- Securely streamed PDF with inline viewer, skeleton loading states, and immediate download affordances.
- Dedicated route retains the brand aesthetic while focusing on recruiter-friendly content.

### Data Storytelling
- **Skills node graph**: D3 force simulation with responsive sizing, zoom, pan, and tooltips.
- **Graph section**: Chart.js + react-chartjs-2 for experience timelines and capability heatmaps.

## Stack

- **Next.js 14 (App Router)** for hybrid rendering, data streaming, and route-level transitions.
- **TypeScript** ensures strict contracts between Sanity schemas, API routes, and UI layers.
- **Tailwind CSS + Radix UI** deliver a cohesive design system with accessible primitives.
- **GSAP & ScrollTrigger** power hero motion, parallax cards, and scroll-linked progress.
- **Sanity CMS** drives projects, tags, about content, CV assets, and footer messaging via GROQ queries.
- **Chart.js, react-chartjs-2, D3** visualize timelines, metrics, and relationship graphs.
- **Next Themes & Lucide** handle theming and iconography with zero layout shifts.

## Motion & Interaction System

- Scroll-triggered fades, staggers, and scale-ins ensure every section enters with intent.
- Button micro-interactions: magnetic hover, Material ripple, and parallax tilt on cards.
- Page-level transitions and a global loading screen keep navigation feeling cinematic.
- Reduced-motion compliance and GPU-friendly transforms maintain 60fps even under stress.

## Content Pipeline

- Headless CMS (Sanity) hosts projects, tags, copy, CV links, and footer metadata.
- GROQ queries are parameterized and cached, with ISR revalidation every 30s.
- Portable Text rendering unlocks rich case studies with links, lists, and highlights.
- Image URLs are generated on demand with `@sanity/image-url`, feeding Next/Image.

## Performance & Accessibility

- Route-level skeletons (Projects, CV) provide instant feedback while data streams in.
- Abortable pagination requests prevent duplicate network calls on rapid interaction.
- Footer timing now hydrates without mismatch, updating relative timestamps client-side.
- WCAG-aware colors, keyboard-accessible dialogs/tooltips, and reduced-motion fallbacks are built-in.

## Roadmap Teasers

Check `docs/PROJECT_PLAN.md` for future experiments such as immersive loading screens, pinned sections, custom cursors, and text-splitting headline treatments.

---

Crafted by [Josh Cyril](https://github.com/JoshCyril) — always iterating on experience, storytelling, and motion.
