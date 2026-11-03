# LeadsGrow™ — You Believe. We Achieve.

Welcome to the official repository for **LeadsGrow™**, an award-winning full-service digital marketing agency website built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **GSAP**, **Framer Motion**, and **Lenis**.

All frontend and backend features (including lead capture, mailing system via Nodemailer, and newsletter subscription) are completely unified in a **single Next.js project**.

---

## 🚀 Key Highlights & Features

- **Unified Single-Folder Architecture**:
  - No separate backend server or monorepo orchestrator needed.
  - Native Next.js 15 App Router API Routes (`/api/leads`, `/api/newsletter`, `/api/health`).
  - Integrated Nodemailer service with admin notification and automated customer confirmation email templates.
  - Automatic JSON storage fallback in `data/leads.json` so the project works immediately with **zero configuration**.
- **Award-Level Creative Design System**:
  - Brand Green (`#16A34A`), Dark background (`#0B0F0D`), electric lime accent (`#B6F23D`), and smooth gradients.
  - High-resolution SVG-derived logo (`Leads` in white + `Grow` in green with upward growth arrow replacing the "o" and ™ mark).
- **Advanced Animations**:
  - **GSAP + ScrollTrigger + Lenis**: Smooth momentum scrolling with Lenis synchronized to GSAP ticker and ScrollTrigger updates.
  - **Editorial Hero**: SplitText character reveal, rotating value propositions cycling through keywords with hand-drawn SVG underline, live interactive growth chart mockup.
  - **Animated Stats Strip**: GSAP count-up numbers with suffix handling (`+`, `L+`, `K+`).
  - **8 Interactive Service Cards**: Hover lift, green border glow, icon rotation/scale, gradient flood fill, staggered sub-services, and outline numbers.
  - **Dual Tilted Marquee Bands**: Infinite ticker bands running in opposite directions with velocity-reactive acceleration on scroll and pause-on-hover.
  - **Tech Stack & Integrations**: 6 categories with animated pill slider (`layoutId`), interactive grid of technologies, and Framer Motion stagger transitions.
  - **Industries We Serve**: 8-industry grid with pixel-aligned benefit badges and "Explore Playbook" triggers.
  - **Center-Focused Testimonial Carousel**: Active card elevation, rating summary, swipe/drag, keyboard controls, and autoplay with pause on hover.
  - **High-Converting CTA & Lead Capture Modal**: Sequentially revealing headline, magnetic pulsing button, Zod + React Hook Form validation, celebratory confetti, and animated checkmark state.
  - **Custom Cursor & Smooth Preloader**: Desktop trailing cursor with "View" / "Drag" modes, and session-aware first-visit loading animation.

---

## 🛠️ Project Structure

```
leadsgrow/
├─ app/
│  ├─ api/
│  │  ├─ health/route.ts      # Health check endpoint
│  │  ├─ leads/route.ts       # Lead capture & email dispatch API
│  │  └─ newsletter/route.ts  # Newsletter subscriber API
│  ├─ layout.tsx              # Root layout, fonts, metadata
│  ├─ page.tsx                # Single-page home page with all sections
│  ├─ globals.css             # Tailwind v4 theme, design tokens
│  └─ not-found.tsx           # Custom 404 page
├─ components/
│  ├─ layout/                 # Header (with mega-menu), Footer, Preloader, CursorFollower, FloatingWidgets
│  ├─ sections/               # Hero, Stats, Services, MarqueeBand, TechStack, Industries, Testimonials, CTA
│  └─ ui/                     # Button, Badge, SectionHeading, MagneticButton, Marquee, Counter, Modal
├─ hooks/                     # useGsap, useLenis, useMediaQuery, useReducedMotion, useHeroTimeline
├─ lib/                       # gsap-register, animations, constants, api, mailer, storage
├─ data/                      # services, techStack, industries, testimonials, stats, leads.json, newsletter.json
├─ public/                    # Logo, icons, static assets
├─ package.json               # Next.js scripts and dependencies
├─ next.config.ts             # Next.js configuration
├─ tsconfig.json              # TypeScript strict configuration
└─ .env.example               # Environment variables template
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Both the website and the API routes (`/api/leads`, `/api/newsletter`) will run seamlessly in the same server.

### 3. Production Build
```bash
npm run build
npm run start
```
