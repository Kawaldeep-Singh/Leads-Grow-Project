# LEADS GROW — Master Prompt for Antigravity

Copy everything below this line and paste it into Antigravity.

---

## 0. ROLE

You are a senior full-stack engineer and award-level creative frontend developer. Build the **Home Page** of **LeadsGrow**, a full-service digital marketing agency website, using **Next.js + TypeScript + Node.js**. The UI must feel premium, modern and highly animated (GSAP + Framer Motion), but fast and fully responsive.

Work step by step: scaffold the project, build the design system, build every section, add animations, build the backend lead API, then test and fix errors. Do not skip sections. Do not use lorem ipsum anywhere except testimonials (see section 6.8).

---

## 1. PROJECT OVERVIEW

- **Project name:** LeadsGrow (brand written as **Leads** + **Grow**, with a ™ mark)
- **Tagline:** *You Believe. We Achieve.*
- **Business:** One-stop digital marketing agency — Digital Marketing, Website Development, App Development, Creative & Design, Performance Marketing, Lead Generation, Marketing Automation, Offline Marketing.
- **Scope now:** Home page only. Structure the code so more pages (About, Services, Contact, Blog) can be added later without refactoring.
- **Languages in UI:** English only.

### Logo
I will provide the logo file. Place it at `/web/public/logo/leadsgrow-logo.png` and use it via `next/image`.
- The logo is a **white "Leads"** + **green "Grow"** wordmark with an upward growth arrow replacing the "o" in Grow. It is white-on-transparent, so it must always sit on a **dark background** (header, footer, preloader).
- Do not redraw or modify the logo. Use it exactly as provided.
- Also create an `icon.png` / favicon from it later (placeholder for now).

---

## 2. TECH STACK (STRICT)

### Frontend (`/web`)
- **Next.js 15 (App Router)** + **TypeScript (strict mode)**
- **Tailwind CSS v4** for styling, with CSS variables for design tokens
- **GSAP** (`gsap`, `ScrollTrigger`, `SplitText`, `ScrollToPlugin`) — for scroll-driven, timeline and text animations
- **Framer Motion** (`motion`) — for component-level animations: mounting/unmounting, hover, tap, layout, tabs, accordions, modals, page transitions
- **Lenis** — smooth scrolling, synced with GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add`)
- **React Hook Form + Zod** — form handling and validation
- **react-icons** (and `simple-icons` where needed) — tech stack icons
- **Swiper** or custom Framer Motion carousel — testimonials
- Font: **Inter** via `next/font` for body, plus a bold display font such as **Plus Jakarta Sans** or **Sora** for headings

### Backend (`/server`)
- **Node.js + Express + TypeScript**
- **MongoDB (Mongoose)** to store leads (use env var `MONGODB_URI`; if absent, fall back to saving in a local JSON file so the project runs without setup)
- **Zod** validation, **helmet**, **cors**, **express-rate-limit**
- **Nodemailer** to email new leads to the admin (SMTP config in `.env`)
- Endpoints:
  - `POST /api/leads` — name, email, phone, service, message → saves + emails
  - `POST /api/newsletter` — email only
  - `GET /api/health`

### Tooling
- ESLint + Prettier, absolute imports (`@/components/...`)
- npm workspaces or two separate folders with their own `package.json`
- A root `README.md` with setup steps and `npm run dev` that starts both apps (use `concurrently`)
- `.env.example` for both apps

### Folder structure
```
leadsgrow/
├─ web/
│  ├─ app/ (layout.tsx, page.tsx, globals.css)
│  ├─ components/
│  │  ├─ layout/ (Header, Footer, Preloader, SmoothScroll, CursorFollower, PageTransition)
│  │  ├─ sections/ (Hero, Stats, Services, TechStack, Industries, Testimonials, CTA)
│  │  └─ ui/ (Button, Badge, SectionHeading, MagneticButton, Marquee, Counter, SplitTextReveal)
│  ├─ hooks/ (useGsap, useLenis, useMediaQuery, useReducedMotion)
│  ├─ lib/ (gsap-register.ts, animations.ts, constants.ts, api.ts)
│  ├─ data/ (services.ts, techStack.ts, industries.ts, testimonials.ts, stats.ts)
│  └─ public/ (logo, images, icons)
└─ server/
   ├─ src/ (index.ts, routes, controllers, models, middleware, utils)
   └─ .env.example
```
All text content must live in `/web/data/*.ts` files (typed), not hard-coded inside components, so I can edit copy easily.

---

## 3. DESIGN SYSTEM

### Brand colors (derived from logo)
- **Brand Green (primary):** `#16A34A` — hover `#15803D`, light `#22C55E`, glow `rgba(34,197,94,0.35)`
- **Ink / Dark:** `#0B0F0D` (main dark bg), `#111815` (cards on dark), `#1A2420` (borders on dark)
- **White:** `#FFFFFF`, off-white section bg `#F6FAF7`
- **Text:** dark `#0B0F0D`, muted `#5B6B63`, on-dark muted `#9FB0A7`
- **Accent (use sparingly):** an electric lime `#B6F23D` for highlights/underline sparks only
- Gradient text for key words: `linear-gradient(90deg, #22C55E, #B6F23D)`

### Theme logic
Alternate **dark sections** (Hero, Services, CTA, Footer) and **light sections** (Stats, Tech Stack, Industries, Testimonials) for strong rhythm. The header is transparent on the dark hero and becomes a blurred glass bar on scroll.

### Typography
- H1: clamp(2.6rem, 6vw, 5.5rem), weight 800, tight line-height (1.05)
- H2: clamp(2rem, 4vw, 3.5rem), weight 700
- Body: 16–18px, line-height 1.7
- Section badge pills: small uppercase, rounded-full, light green bg, green text (like the "Our Tech Stack" pill in the reference)
- Section headings use the pattern: **plain word(s) + gradient-colored keyword** (e.g. "Technologies & <gradient>Integrations</gradient>")

### Components
- Buttons: pill-shaped, primary = green solid with glow, secondary = outline. Arrow icon that slides on hover. Magnetic hover effect on primary CTAs.
- Cards: rounded-3xl, 1px border, soft shadow, hover lift + green border glow.
- Container: max-width 1280px, padding 20px mobile / 40px desktop.
- Fully responsive: 360px → 1920px. Mobile-first. No horizontal scroll.

---

## 4. ANIMATION SYSTEM (MOST IMPORTANT)

Reference sites to take animation inspiration from:
- https://www.digidir.com/ — mega-menu with panels and stat strips, looping decorative text bands/marquees, numbered cards (01/06, 02/06…) that reveal on scroll, count-up stats, testimonial carousel where the clicked card moves to center, accordion with +/− toggles, big final CTA band.
- https://www.hidemedia.co.in/ — hero with an animated dashboard mockup, stats bar with counters, tabbed **Technologies & Integrations** section, hover-lift service cards, logo marquee, sticky WhatsApp/callback floating widgets.

Do NOT copy their code, text, branding or assets. Recreate the same *kinds* of motion in an original LeadsGrow style.

### Division of labor
- **GSAP + ScrollTrigger + Lenis:** page-level, scroll-linked and timeline animation (hero intro timeline, pinned/scrubbed sections, parallax, horizontal movement, counters, text splitting, marquee speed-by-scroll-velocity, section reveals).
- **Framer Motion:** component-level (header mount/hide-on-scroll, mobile menu, tab switching with `AnimatePresence` + shared `layoutId` underline/pill, hover/tap, modal, form success state, stagger of lists, accordion).
- Never animate the same property on the same element with both libraries.

### Global animations
1. **Preloader (first visit only, ~2s):** dark screen, logo draws/fades in, green progress bar or growth arrow shoots upward, counter 0→100, then the screen slides up (clip-path/translateY) to reveal the hero. Store a session flag so it does not replay on every navigation.
2. **Smooth scroll:** Lenis with GSAP sync. Disable on reduced-motion.
3. **Custom cursor (desktop only):** small green dot + trailing ring that grows over links/buttons and shows "View" or "Drag" labels over cards/carousel. Hidden on touch devices.
4. **Scroll progress bar:** thin green bar at the top of the page.
5. **Header:** transparent on top → glass blur + shadow after 80px; hides on scroll down, shows on scroll up (Framer Motion). Nav links have an animated underline. Services link opens a **mega-menu** (see 6.1).
6. **Page transitions:** subtle fade/slide using Framer Motion between routes.
7. **Floating widgets:** WhatsApp button (bottom-left) and "Get Free Consultation" button (bottom-right) with a pulse ring; both appear after 3s using Framer Motion spring.
8. **Reveal defaults:** headings use a SplitText line/word reveal (translateY 100% → 0 with mask, stagger 0.06); paragraphs fade-up; cards stagger in with `y: 60, opacity: 0`. Use `ScrollTrigger` with `start: "top 85%"`, `once: true` for reveals.
9. **Respect `prefers-reduced-motion`:** turn off parallax, cursor, marquee speed changes and heavy timelines; keep simple fades.
10. **Performance:** use `will-change` only during animation, `gsap.context()` + cleanup in `useEffect`/`useGSAP`, `ScrollTrigger.refresh()` after fonts/images load, lazy-load below-the-fold sections and images, keep Lighthouse Performance ≥ 90.

---

## 5. PAGE STRUCTURE (TOP TO BOTTOM)

1. Header (with mega-menu)
2. Hero / Banner
3. Stats strip
4. "Explore What We Offer" — 8 service cards
5. Decorative marquee band (service keywords)
6. Technologies & Integrations (tabbed)
7. Industries We Serve
8. Testimonials
9. CTA band — "Want More Leads?…"
10. Footer
Floating: WhatsApp button, consultation button, scroll progress, cursor.

---

## 6. SECTION-BY-SECTION SPEC (USE THIS EXACT CONTENT)

### 6.1 Header
- Logo (left), nav: Home, About, Services (mega-menu), Industries, Portfolio, Blog, Contact. Right: **"Contact Us"** primary button.
- **Services mega-menu** (opens on hover desktop / accordion on mobile): shows the 8 service categories in a grid, each with a small icon and its sub-services, plus a small stats strip (50L+ Leads, 5K+ Campaigns) and a "Contact Us" button. Animate with Framer Motion (fade + y offset + stagger items).
- **Mobile:** hamburger → full-screen off-canvas menu sliding in from the right, items stagger in, accordion for Services, "Contact Us" button at bottom.
- Top utility bar (desktop only, dark): phone, email, WhatsApp, social icons (use placeholder values in `constants.ts`).

### 6.2 Hero / Banner
Dark background with animated gradient mesh / glowing green orbs, subtle grid pattern and floating particles. Content:

- **Rotating headline lines (cycle every ~3.5s with GSAP/Framer text swap; first one is the H1 on load):**
  1. "Everything Under One Roof to Grow Your Brand." — sub: "From Branding to Business Growth."
  2. "We Don't Just Generate Leads. We Generate Business." — sub: "From Leads to Sales, We Do It All."
  3. "15+ Years of Marketing Expertise To Make Your Business Bigger."
- Highlight words ("Grow Your Brand", "Generate Business", "Bigger") with the green gradient.
- Big tagline pill/text: **You Believe. We Achieve.**
- CTAs: **"Get Free Strategy Call"** (primary, magnetic) and **"Explore Services"** (outline, scrolls to services with ScrollToPlugin).
- Right side (desktop): an animated **growth dashboard mockup** — cards for "Leads", "Sales", "Revenue", "ROAS", a line chart that draws itself (SVG stroke-dashoffset with GSAP), floating chips ("+248 New Leads", "Campaign Live") that bob up and down, and a growth arrow that shoots upward. Slight mouse-parallax on the layers.
- Hero intro timeline: badge fades in → headline lines reveal word by word → sub text → buttons pop → dashboard slides/scales in → floating chips start loop.
- Scroll cue: animated mouse/arrow at the bottom.
- On scroll, hero content parallaxes up slightly and fades while the dashboard moves slower (scrub).

### 6.3 Stats strip
Four stats with **GSAP count-up** triggered when in view (ease `power2.out`, ~2s), each with a small icon and a divider:
- **7+** Years Experience
- **50L+** Quality Leads Delivered
- **5K+** Campaigns Managed
- **10+** Industries Served

Counter must handle suffixes ("+", "L+", "K+") — animate the number only. Cards stagger in. Slight overlap with the hero bottom edge (negative margin) for a modern layered feel.

### 6.4 Explore What We Offer (Services)
- Badge: "Explore What We Offer"
- H2: **Complete Marketing Solutions. All Under One Roof.**
- Subtext (italic): *Everything Your Business Needs to Grow.*

Render **8 numbered cards** (01/08 … 08/08) in a responsive grid (4 columns desktop, 2 tablet, 1 mobile). Each card has: number, icon, title, bullet list of sub-services, and an arrow "Explore Service" link.

1. **Digital Marketing** — SEO, SMO, Google Ads, Meta Ads, LinkedIn Ads
2. **Website Development** — Business Websites, E-commerce Websites, Landing Pages, Custom Web Development
3. **App Development** — Android App Development, iOS App Development, Custom Mobile Apps, App UI/UX
4. **Creative & Designing** — Graphic Design, UI/UX Design, Brand Identity, Social Media Creatives
5. **Performance Marketing** — PPC Campaigns, Conversion Optimization, Retargeting, Campaign Management
6. **Lead Generation** — B2B Lead Generation, B2C Lead Generation, Qualified Leads, Customer Acquisition
7. **Marketing Automation** — WhatsApp Marketing, Email Marketing, SMS Marketing, Affiliate Marketing
8. **Offline Marketing** — Ground Branding, Printing Solutions, Outdoor Advertising, Promotional Activities

Animations:
- Cards stagger-reveal on scroll (GSAP batch).
- Hover: card lifts, border glows green, icon rotates/scales, a green gradient fills from the bottom/cursor position, bullet items slide right with stagger, arrow moves.
- Optional desktop enhancement: pinned horizontal-scroll variant (GSAP ScrollTrigger pin + scrub) — but keep the normal grid on mobile.
- Large faded outline number in the card background that parallaxes slightly.

### 6.5 Decorative marquee band
A tilted (-2deg) green band with infinitely scrolling keywords separated by star/arrow icons:
`SEO ✦ Google Ads ✦ Meta Ads ✦ Web Development ✦ App Development ✦ Branding ✦ Lead Generation ✦ Automation ✦ Performance Marketing`
A second row on a dark band scrolls in the **opposite direction**. Speed increases with scroll velocity (GSAP + Lenis velocity), pauses on hover.

### 6.6 Technologies & Integrations (copy the structure of the hidemedia.co.in tech stack section)

- Badge pill: **Our Tech Stack**
- H2: **Technologies & <gradient>Integrations</gradient>**
- Sub: *Tools we use to build your success*
- **6 tabs (pill buttons):** Web Platform · Cloud & DB · Mobile · Design · Marketplaces · Payments
  - Active tab = solid blue/green pill with a shared `layoutId` background that slides between tabs (Framer Motion). Inactive = light bordered pills. Tabs scroll horizontally on mobile.
- Below: a centered, wrapping **icon grid**. Each item = rounded-2xl light card (≈100×100) with the brand icon + label under it. Switching tab uses `AnimatePresence mode="wait"`: old icons scale/fade out, new icons stagger in (`y: 20, scale: 0.8, opacity: 0` → normal, stagger 0.04).
- Hover: card lifts, icon bounces/scale 1.1, soft colored shadow.
- Data (put in `data/techStack.ts`, typed by tab):
  - **Web Platform:** HTML, CSS, JavaScript, PHP, CodeIgniter, Laravel, WordPress, Opencart, Shopify, Python, React JS, Node JS, Angular JS, Next.js, TypeScript
  - **Cloud & DB:** PostgreSQL, MySQL, MongoDB, AWS, Google Cloud, Firebase, Java
  - **Mobile:** Android Studio, Apple Developer, Flutter, React Native, WebView
  - **Design:** Photoshop, Illustrator, Premiere Pro, After Effects, CorelDRAW, Figma
  - **Marketplaces:** Amazon, Flipkart, Shopify, Meesho, Myntra, Snapdeal
  - **Payments:** Razorpay, PayU, PayPal, CCAvenue, Stripe, Cashfree, PhonePe
- Use official-looking colored SVG icons (react-icons / simple-icons; fall back to a clean text-badge if an icon doesn't exist, e.g. Meesho, Cashfree, CCAvenue). Do not hotlink external images.
- Section also has a subtle slow-moving background (dotted grid + floating blurred green/blue blobs) and a 3D tilt effect on cards (desktop, subtle).

### 6.7 Industries We Serve
- Badge: "Industries"
- H2: **Growing Businesses Across Industries.**
- 10 industries: **Real Estate, ISP, Retail, HR, Healthcare, Education, E-commerce, IT, Foods, Hospitality**
- Layout: a large interactive grid of 10 pills/cards, each with a distinct icon. On hover, the card expands/fills with green and shows a one-line benefit (write short, original microcopy like "Qualified buyer leads that book site visits"). On mobile, they become a 2-column grid.
- Animation: cards fly in from random directions with stagger; a continuous slow floating motion on desktop; also add a 2-row infinite marquee version of the industry names behind the grid as texture.

### 6.8 Testimonials
- Badge: "Testimonials"
- H2: **What Our Clients Say**
- Content is not final — create **6 realistic placeholder testimonials** (name, role, company, 5-star rating, short quote about leads/sales growth) stored in `data/testimonials.ts` so I can swap them. Mark them clearly with a `// TODO: replace with real testimonials` comment.
- Layout: center-focused carousel — the active card is large and centered, neighbors are scaled down/blurred on the sides; clicking a side card moves it to the center (like DigiDir). Support drag/swipe, arrow buttons, dots, keyboard arrows and autoplay with pause on hover. Animate with Framer Motion (layout + spring) or Swiper coverflow.
- Add an overall rating summary badge ("4.9/5 rated by our clients") and big quote mark decoration that parallaxes.

### 6.9 (Reserved) — leave room for a future "Why Choose Us" and "FAQ" section; do not build them now.

### 6.10 CTA band
Full-width dark section with a glowing green gradient, animated growth-arrow lines and floating shapes.
- **H2:** Want More Leads? More Sales? More Revenue? Bigger Growth?
  - Each of the four phrases reveals one after another (typewriter or stacked word reveal), the last "Bigger Growth?" in gradient.
- **Button:** **Let's Talk LeadsGrow!** — large, magnetic, pulsing glow. Opens a **lead capture modal** (Framer Motion scale + backdrop blur) with a form: Name, Email, Phone, Service (select with the 8 services), Message. Validate with Zod, submit to `POST /api/leads`, show animated loading → success checkmark (SVG draw) → auto-close. Show inline field errors with shake animation.
- Also provide a secondary "Chat on WhatsApp" button.

### 6.11 Footer (content not final — build a complete professional placeholder footer)
Dark background, giant faded "LEADSGROW" wordmark at the bottom that reveals on scroll (stroke/outline text). Columns:
1. Logo + short description + social icons (Facebook, Instagram, LinkedIn, X, YouTube) with hover bounce
2. Services (the 8 categories)
3. Company (About, Portfolio, Blog, Careers, Contact)
4. Industries (the 10 industries)
5. Contact: address, phone, email, working hours (placeholders in `constants.ts`)
- Newsletter input (posts to `/api/newsletter`).
- Bottom bar: © 2026 LeadsGrow™. All rights reserved. · Privacy Policy · Terms.
- "Back to top" circular button with progress ring, scrolls using GSAP ScrollToPlugin.

---

## 7. BACKEND DETAILS (`/server`)

- Lead model: `name, email, phone, service, message, source ("home-cta" | "modal" | "newsletter"), createdAt`.
- Validate with Zod; return `{ success: boolean, message: string }`.
- Rate limit: 10 requests / 15 min / IP.
- CORS: allow only `process.env.CLIENT_URL`.
- Send two emails with Nodemailer: admin notification and an auto-reply to the user ("Thanks for contacting LeadsGrow, we'll reach out within 24 hours").
- Include clear error handling middleware and a typed `.env` loader.
- Frontend `lib/api.ts` uses `NEXT_PUBLIC_API_URL`.

---

## 8. SEO, ACCESSIBILITY, QUALITY

- Metadata API: title "LeadsGrow — Digital Marketing, Web & App Development, Lead Generation", description, Open Graph, Twitter card, canonical, JSON-LD `Organization` + `ProfessionalService`.
- One H1 only. Semantic landmarks, alt text, labels on all inputs, visible focus rings, color contrast AA.
- All animations must be skippable via reduced motion.
- Use `next/image` with proper `sizes`; use `dynamic()` for heavy sections.
- No console errors or hydration warnings. `npm run build` and `npm run lint` must pass with zero errors.
- Everything typed — no `any`.

---

## 9. ASSETS

- Logo: provided by me (`/web/public/logo/leadsgrow-logo.png`).
- Images: do not use copyrighted images. Use CSS/SVG illustrations, gradients and generated abstract shapes. Where a photo is needed, add a clearly named placeholder in `/web/public/images/` and note it in the README.
- Icons: react-icons / lucide-react.

---

## 10. DELIVERY CHECKLIST

When finished, confirm:
- [ ] Both apps run with one command (`npm run dev` at root)
- [ ] All 10 sections built with the exact copy above
- [ ] GSAP + ScrollTrigger + Lenis working together without jitter
- [ ] Framer Motion tabs, modal, header, mobile menu, carousel working
- [ ] Preloader, custom cursor, scroll progress, marquees working
- [ ] Responsive at 360 / 768 / 1024 / 1440 / 1920
- [ ] Lead form saves to DB (or JSON fallback) and sends email
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95
- [ ] README with setup + env instructions

Start now: scaffold the monorepo, then build the design system, then sections in the order listed. After each major section, run the app and fix any errors before moving on.
