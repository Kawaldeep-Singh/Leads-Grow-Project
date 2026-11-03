# LeadsGrow™ — You Believe. We Achieve.

Welcome to the official repository for **LeadsGrow™**, an award-winning full-service digital marketing agency website built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **GSAP**, **Framer Motion**, **Lenis**, and a high-performance **Node.js Express + TypeScript** backend.

---

## 🚀 Key Highlights & Features

- **Award-Level Creative Design System**:
  - Exact brand colors: Brand Green (`#16A34A`), Ink/Dark background (`#0B0F0D`), cards (`#111815`), electric lime accent (`#B6F23D`), and smooth gradients.
  - Alternating dark & light rhythmic sections.
  - High-resolution SVG-derived logo (`Leads` in white + `Grow` in green with upward growth arrow replacing the "o" and ™ mark).
- **Advanced Animations**:
  - **GSAP + ScrollTrigger + Lenis**: Smooth momentum scrolling with Lenis synchronized to GSAP ticker and ScrollTrigger updates.
  - **Hero Intro & Live Dashboard Mockup**: Rotating value propositions cycling every ~3.5s, self-drawing SVG line charts, bobbing metric chips, and subtle mouse-parallax layer movements.
  - **Animated Stats Strip**: GSAP count-up numbers with suffix handling (`+`, `L+`, `K+`) and layered negative-margin positioning.
  - **8 Interactive Service Cards**: Hover lift, green border glow, icon rotation/scale, gradient flood fill, staggered sub-services, and faint outline numbers.
  - **Dual Tilted Marquee Bands**: Infinite ticker bands running in opposite directions with velocity-reactive acceleration on scroll and pause-on-hover.
  - **Tech Stack & Integrations**: 6 categories with animated pill slider (`layoutId`), interactive grid of 40+ technologies, and Framer Motion stagger transitions.
  - **Industries We Serve**: 10-industry grid with benefit reveals and dual-row background text marquee.
  - **Center-Focused Testimonial Carousel**: Active card elevation, rating summary, swipe/drag, keyboard controls, and autoplay with pause on hover.
  - **High-Converting CTA & Lead Capture Modal**: Sequentially revealing headline, magnetic pulsing button, Zod + React Hook Form validation, celebratory confetti, and animated checkmark state.
  - **Custom Cursor & Smooth Preloader**: Desktop trailing cursor with "View" / "Drag" modes, and session-aware first-visit loading animation.
- **Robust Full-Stack Backend**:
  - Express.js + TypeScript + Helmet + CORS + Rate Limiter (10 requests / 15 min / IP).
  - Dual-mode data persistence: automatically connects to MongoDB via Mongoose if `MONGODB_URI` is supplied; gracefully falls back to local JSON file storage (`server/data/leads.json`) so the project runs out of the box with **zero manual setup**!
  - Nodemailer service with admin notification and automated customer confirmation email templates.

---

## 🛠️ Project Structure

```
leadsgrow/
├─ package.json              # Monorepo concurrently orchestrator
├─ README.md                 # Documentation & setup guide
├─ web/                      # Next.js 15 Frontend
│  ├─ app/
│  │  ├─ layout.tsx          # Root layout, fonts, metadata, JSON-LD schemas
│  │  ├─ page.tsx            # Single-page home page with all 10 sections
│  │  ├─ globals.css         # Tailwind v4 theme, design tokens, glassmorphism
│  │  └─ icon.png            # App favicon
│  ├─ components/
│  │  ├─ layout/             # Header (with mega-menu), Footer, Preloader, CursorFollower, FloatingWidgets
│  │  ├─ sections/           # Hero, Stats, Services, MarqueeBand, TechStack, Industries, Testimonials, CTA
│  │  └─ ui/                 # Button, Badge, SectionHeading, MagneticButton, Marquee, Counter, Modal
│  ├─ hooks/                 # useGsap, useLenis, useMediaQuery, useReducedMotion
│  ├─ lib/                   # gsap-register, animations, constants, api
│  ├─ data/                  # services, techStack, industries, testimonials, stats
│  └─ public/
│     ├─ logo/               # leadsgrow-logo.png
│     └─ icon.png            # App icon
└─ server/                   # Node.js + Express Backend
   ├─ src/
   │  ├─ config/             # Typed environment loader
   │  ├─ controllers/        # Lead & Newsletter controllers with Zod validation
   │  ├─ middleware/         # Rate limiting & global error handling
   │  ├─ models/             # Mongoose schemas for MongoDB
   │  ├─ routes/             # REST endpoints (/api/leads, /api/newsletter, /api/health)
   │  ├─ services/           # Dual storage engine (MongoDB + JSON fallback) & Mailer
   │  └─ index.ts            # Express server initialization
   └─ .env.example           # Server environment template
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ / v22+ / v24+ recommended)
- **npm**: v9+ or later

### 2. Installation
Run `npm install` from the root directory to install the monorepo runner:
```bash
npm install
```

Install frontend dependencies:
```bash
npm install --prefix web
```

Install backend dependencies:
```bash
npm install --prefix server
```

### 3. Environment Setup (Optional)
The project works out of the box without any setup. If you wish to configure MongoDB or SMTP email dispatch, edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/leadsgrow   # Optional: falls back to server/data/leads.json
SMTP_HOST=smtp.gmail.com                         # Optional: logs to console if omitted
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=leads@leadsgrow.com
```

### 4. Running Locally
Start both the Next.js frontend (port 3000) and Express backend (port 5000) concurrently with a single command:
```bash
npm run dev
```

Visit:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Production Build & Verification

To compile and verify both the frontend and backend:
```bash
npm run build
```

---

## 📄 License & Attribution
© 2026 LeadsGrow™. All rights reserved. *You Believe. We Achieve.*

