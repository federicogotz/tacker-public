# Tacker.app — Homepage Integration Plan

This document is a complete, step-by-step directive for converting the homepage prototype (`tacker-homepage.jsx`) into production Next.js + Tailwind components and integrating it into the live Tacker.app codebase.

It is designed to be fed to Claude Code alongside the design system files. Every decision is made. Nothing is ambiguous.

---

## Prerequisites

Before starting, the following must be true:

1. **Design system files are committed to the repo.** The following files from the design system package should already be in the codebase:
   - `docs/DESIGN_SYSTEM.md` — Full design system specification
   - `tailwind.config.ts` — Extended with design tokens (or tokens merged into existing config)
   - `app/globals.css` — CSS custom properties for light/dark + Google Fonts import
   - `components/ui/*.tsx` — All 9 primitive components (Button, Badge, Input, Card, Toggle, Avatar, ProgressBar, Alert, MonoValue)
   - `components/ui/index.ts` — Barrel export
   - `lib/utils.ts` — `cn()` utility (skip if it already exists from shadcn/ui or similar)

2. **Dependencies installed:**
   - `clsx` and `tailwind-merge` (only if `cn()` utility was added)
   - No other new dependencies required

3. **Reference file available:**
   - `tacker-homepage.jsx` — The prototype artifact. This is the visual reference showing exactly what each section looks like and how it behaves. It is NOT production code — it uses inline styles and needs full conversion to Tailwind classes.

---

## Step 0: Understand the architecture

The homepage is 10 sections assembled in this order:

```
app/page.tsx (or app/(marketing)/page.tsx)
  └── components/homepage/
        ├── Navbar.tsx          ← Sticky nav + CTA
        ├── Hero.tsx            ← Headline + phone mockup
        ├── SocialProof.tsx     ← Trust metrics bar
        ├── Features.tsx        ← 3 feature cards
        ├── Showcase.tsx        ← Tabbed phone mockup with 3 screens
        ├── HowItWorks.tsx      ← 3 step cards
        ├── Testimonials.tsx    ← 3 review cards
        ├── FAQ.tsx             ← Accordion (6 items)
        ├── FinalCTA.tsx        ← Dark CTA section
        ├── Footer.tsx          ← 4-column footer
        ├── PhoneMockup.tsx     ← Reusable phone frame (used by Hero + Showcase)
        ├── useReveal.ts        ← IntersectionObserver hook for scroll animations
        └── index.ts            ← Barrel export
```

Each section is a self-contained component. The page file composes them in order. Shared UI primitives (Button, Badge, Avatar, etc.) come from `components/ui/`.

---

## Step 1: Create the shared hook

### File: `components/homepage/useReveal.ts`

Extract the `useInView` / `Reveal` pattern from the prototype into a reusable hook.

**Behavior:**
- Uses IntersectionObserver with threshold 0.08
- Returns a ref and a boolean `isVisible`
- Once visible, stays visible (observer disconnects)
- Fires only once per element

**Implementation:**
```tsx
import { useRef, useState, useEffect } from 'react';

export function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
```

### File: `components/homepage/Reveal.tsx`

A wrapper component that applies the fade-up animation:

```tsx
'use client';
import { useReveal } from './useReveal';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref}
      className={cn(
        'motion-safe:transition-all motion-safe:duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7',
        className
      )}
      style={{ transitionDelay: `${delay}s`, transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {children}
    </div>
  );
}
```

---

## Step 2: Create the PhoneMockup component

### File: `components/homepage/PhoneMockup.tsx`

This is used by both Hero and Showcase. It renders a realistic phone frame with a notch, status bar area, and content slot.

**Specs from prototype:**
- Width: 300px (Hero) / 290px (Showcase)
- Height: 600px (Hero) / 580px (Showcase)
- Border radius: 40px / 38px
- Border: 1.5px `border-default`
- Shadow: large layered shadow (32px blur + 12px blur + 1px ring)
- Notch: 126px wide, 30px tall, `bg-primary` with rounded bottom corners
- Status bar spacer: 52px / 48px
- Content padding: 0 18px 18px

**Accept props:** `size?: 'default' | 'compact'` and `children`

**Tailwind conversion:**
- Frame: `bg-card border border-default overflow-hidden relative` + custom rounded/shadow via style prop (Tailwind's max rounded is 3xl = 24px, these need 38-40px)
- Notch: `absolute top-0 left-1/2 -translate-x-1/2 bg-primary` with bottom rounded corners
- Use inline style only for border-radius (40px/38px) and the layered box-shadow — these exceed Tailwind defaults

---

## Step 3: Convert each section

For each section below, create the file and convert all inline styles to Tailwind classes. Follow these rules:

### Conversion Rules

1. **Colors:** Replace all `c.text`, `c.accent`, etc. with Tailwind token classes:
   - `c.text` → `text-primary`
   - `c.sec` → `text-secondary`
   - `c.muted` → `text-muted`
   - `c.accent` → `text-accent`
   - `c.success` → `text-success`
   - `c.error` → `text-error`
   - `c.bg` → `bg-bg`
   - `c.card` → `bg-card`
   - `c.subtle` → `bg-subtle`
   - `c.border` → `border-default`
   - `c.borderSub` → `border-subtle`
   - `c.accentSub` → `bg-accent-subtle`

2. **Typography:** Replace inline font declarations:
   - `fontFamily: H` (Sora) → `font-heading`
   - `fontFamily: B` (DM Sans) → `font-body`
   - `fontFamily: M` (DM Mono) → `font-mono`
   - Use the custom text scale classes where they match: `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-h4`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`, `text-overline`
   - For sizes that don't exactly match a scale step, use Tailwind arbitrary values: `text-[15px]`, `text-[13px]`, etc.

3. **Spacing:** Convert pixel values to Tailwind spacing:
   - 4px = `1`, 8px = `2`, 12px = `3`, 16px = `4`, 20px = `5`, 24px = `6`, 28px = `7`, 32px = `8`, 36px = `9`, 40px = `10`, 48px = `12`, 56px = `14`, 64px = `16`, 80px = `20`, 88px = `22`, 96px = `24`
   - For non-standard values: use arbitrary `p-[28px]`, `gap-[72px]`, etc.

4. **Layout:** Convert inline flex/grid to Tailwind:
   - `display: "flex"` → `flex`
   - `alignItems: "center"` → `items-center`
   - `justifyContent: "space-between"` → `justify-between`
   - `gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"` → `grid grid-cols-1 md:grid-cols-3` (use responsive breakpoints instead of auto-fit for better control)
   - `flexWrap: "wrap"` → `flex-wrap`
   - `maxWidth: 1120` → `max-w-[1120px]` (add as a custom value or use a container approach)

5. **Use UI primitives:** Replace inline button/badge/avatar implementations with imports from `@/components/ui`:
   - Inline buttons → `<Button variant="primary" size="lg">Download Free</Button>`
   - Inline badges → `<Badge variant="accent">Smart</Badge>`
   - Inline avatars → `<Avatar initials="ME" size="sm" />`
   - Inline progress bars → `<ProgressBar value={72} />`
   - Inline money values → `<MonoValue size="lg" variant="income">+€3,200</MonoValue>`

6. **Client components:** Add `'use client'` directive to any component that uses hooks (useState, useEffect, useRef) or event handlers (onClick). Static sections without interactivity can remain server components.

7. **Responsive:** The prototype has `clamp()` for font sizes and `flex-wrap` for layouts. Convert to proper Tailwind responsive breakpoints:
   - Hero headline: `text-[2.5rem] md:text-[3rem] lg:text-[3.75rem]`
   - Two-column layouts: `flex flex-col lg:flex-row`
   - Card grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

8. **Images/assets:** The prototype uses inline SVG icons. Keep these as inline SVGs or switch to Lucide React icons (`lucide-react` package) for consistency with the design system spec (24px, 1.75 stroke width).

---

## Step 4: Section-by-section specifications

### 4.1 Navbar (`Navbar.tsx`)

**Client component** — uses `useState` + `useEffect` for scroll detection.

**Structure:**
```
<nav> (fixed, full-width, z-50)
  <div> (max-w container, h-16, flex between)
    <Logo> (32px icon + "Tacker" wordmark)
    <Links> (Features, How it works, FAQ — anchor links)
    <Button> (from components/ui, size="sm")
  </div>
</nav>
```

**Key behaviors:**
- Transparent on load, frosted-glass on scroll (after 30px)
- Scroll state controls: `backdrop-blur-xl`, `bg-[rgba(253,252,250,0.92)]`, `border-b border-default`
- Links use anchor hrefs: `#features`, `#how-it-works`, `#faq`
- Mobile: hide links, show hamburger + persistent CTA (not in prototype — add responsive handling)

**Tailwind classes for nav:**
- Default: `fixed top-0 left-0 right-0 z-50 transition-all duration-300`
- Scrolled: `backdrop-blur-xl bg-[rgba(253,252,250,0.92)] border-b border-default`
- Not scrolled: `bg-transparent border-b border-transparent`

### 4.2 Hero (`Hero.tsx`)

**Client component** — uses Reveal animations.

**Structure:**
```
<section> (pt-32, pb-20)
  <div> (container, flex row on lg, column on mobile)
    <div> (copy side — flex-1)
      <Reveal> overline badge
      <Reveal> h1 headline
      <Reveal> p description
      <Reveal> buttons + reassurance text
    </div>
    <Reveal> (phone side — flex-shrink-0)
      <PhoneMockup>
        Dashboard header
        Balance card (MonoValue for amounts)
        Mini bar chart (12 bars)
        Transaction list (5 rows with Avatar + MonoValue)
      </PhoneMockup>
    </Reveal>
  </div>
</section>
```

**Phone mockup content detail:**
- "Dashboard" header in Sora 16/700
- Balance card: overline "April Balance" + MonoValue €352.50 (size lg) + 3 sub-stats (Income/Expenses/Saving as MonoValue size sm)
- 12 bar chart: divs with varying height %, accent color on bar 10, 25% opacity on others
- 5 transaction rows: Avatar sm + name (DM Sans 12.5/600) + category (DM Sans 10.5/muted) + MonoValue amount

**Responsive:**
- Desktop (lg+): two columns, 72px gap
- Mobile: single column, phone below copy, phone centered

### 4.3 SocialProof (`SocialProof.tsx`)

**Structure:**
```
<section> (bg-subtle, border-y border-default, py-8)
  <div> (container, flex center, gap-14, wrap)
    {stats.map → value (Sora 24/700) + label (DM Sans 13/muted)}
    Vertical dividers between stats
  </div>
</section>
```

**Data:** `10K+ Downloads`, `4.8★ App Store`, `30+ Countries`, `100% Private & encrypted`

### 4.4 Features (`Features.tsx`)

**Structure:**
```
<section> (py-22, id="features")
  <div> (container)
    <Reveal> section header (overline + h2)
    <div> (3-col grid)
      {features.map → <Reveal> <Card>
        icon (48px rounded container with SVG) + Badge
        h3 title (Sora 19/700)
        p description (DM Sans 15/1.6)
      </Card> </Reveal>}
    </div>
  </div>
</section>
```

**Icons:** Use Lucide React — `Zap` for AI tracking, `BarChart3` for insights, `CircleDollarSign` for saving rate. Size 22px, stroke 1.75.

### 4.5 Showcase (`Showcase.tsx`)

**Client component** — uses `useState` for tab switching.

**Structure:**
```
<section> (bg-subtle, py-22, border-y)
  <div> (container, flex row lg / col mobile)
    <div> (copy + tab selector + context bullet)
    <PhoneMockup size="compact">
      {tab === 0 && <DashboardScreen />}
      {tab === 1 && <TransactionsScreen />}
      {tab === 2 && <InsightsScreen />}
    </PhoneMockup>
  </div>
</section>
```

**Tab selector:** Segmented control — inline-flex with bg-card border, buttons toggle active state.

**Screen contents (keep as sub-components within the file):**
- DashboardScreen: 2×2 stat grid + budget progress bar
- TransactionsScreen: 7 transaction rows
- InsightsScreen: 6 category bars + donut SVG chart

### 4.6 HowItWorks (`HowItWorks.tsx`)

**Structure:**
```
<section> (py-22, id="how-it-works")
  <div> (container)
    <Reveal> section header
    <div> (3-col grid)
      {steps.map → <Reveal> <Card>
        step number (DM Mono 13/500 accent)
        visual block (bg-subtle rounded container)
        h3 title
        p description
      </Card> </Reveal>}
    </div>
  </div>
</section>
```

**Step visuals:**
1. Two app store badge buttons (black bg, white text)
2. Quick-add UI mock: + button, amount in MonoValue, AI category badge
3. Bar chart building up (12 bars, last 4 highlighted)

### 4.7 Testimonials (`Testimonials.tsx`)

**Structure:**
```
<section> (bg-subtle, py-22, border-y)
  <div> (container)
    <Reveal> section header ("Loved by people who hate spreadsheets.")
    <div> (3-col grid)
      {reviews.map → <Reveal> <Card>
        5 star SVGs in accent color
        italic quote (DM Sans 15.5/1.6)
        author: Avatar + name + role
      </Card> </Reveal>}
    </div>
  </div>
</section>
```

**Copy (use exactly these quotes):**
1. "I tried every finance app out there. Tacker is the first one that actually stuck — because it takes 3 seconds to log something." — Sofia M., Marketing Manager
2. "The AI categorization is scary good. After a week it knew that 'Mercadona' is groceries and 'Glovo' is takeout. I barely touch it now." — Daniel R., Software Engineer
3. "Seeing my actual saving rate every month changed how I think about spending. Simple number, huge impact." — Laura K., Freelance Designer

### 4.8 FAQ (`FAQ.tsx`)

**Client component** — uses `useState` for accordion open/close.

**Structure:**
```
<section> (py-22, id="faq")
  <div> (max-w-[720px] container — narrower than other sections)
    <Reveal> section header
    {items.map → <Reveal>
      <div> (border-b)
        <button> question text + rotating + icon
        <div> (animated max-height for answer)
          <p> answer text
        </div>
      </div>
    </Reveal>}
  </div>
</section>
```

**Accordion behavior:**
- Only one item open at a time (clicking a new one closes the previous)
- + icon rotates 45° to × when open
- Answer slides open via `max-h-0 → max-h-[300px]` with `overflow-hidden transition-all duration-350`

**Questions and answers (use exactly this copy):**
1. **Is Tacker free?** — "Yes. Tacker is completely free to download and use. We offer a premium plan with advanced features like bank sync and unlimited export, but the core tracking experience is free forever."
2. **How does the AI categorization work?** — "When you log a transaction, our AI analyzes the merchant name and amount to suggest a category. It learns from your corrections, so it gets more accurate over time. After a week of use, most transactions are categorized automatically."
3. **Is my financial data secure?** — "Absolutely. All data is encrypted end-to-end and stored on your device. We never sell your data, and we don't have access to your bank credentials. Your finances stay private."
4. **Does it connect to my bank?** — "The free version is manual entry — which many users prefer for mindful spending. Premium offers optional bank sync through secure open banking APIs so transactions import automatically."
5. **What platforms is it available on?** — "Tacker is available on iOS and Android. A web dashboard for viewing your data on desktop is on the roadmap."
6. **Can I export my data?** — "Yes. You can export all your transactions as CSV at any time. Your data belongs to you, always."

### 4.9 FinalCTA (`FinalCTA.tsx`)

**Structure:**
```
<section> (bg-primary — this is the inverted dark section)
  <div> (container, text-center)
    <Reveal>
      h2 headline (Sora, text-primary-foreground)
      p subtext (DM Sans, 70% opacity white)
      Button (inverted — white bg, dark text) + ghost Button
      App store badges (glass-style containers)
      Reassurance line (45% opacity white)
    </Reveal>
  </div>
</section>
```

**Color handling:** This section uses `bg-primary` (black in light mode, warm white in dark mode). All text inside uses `text-primary-foreground`. Since CSS custom properties handle the inversion, this works automatically in both themes. For reduced-opacity text, use Tailwind opacity modifiers: `text-primary-foreground/70`, `text-primary-foreground/45`.

### 4.10 Footer (`Footer.tsx`)

**Structure:**
```
<footer> (border-t, pt-14 pb-10)
  <div> (container)
    <div> (flex between, wrap)
      <BrandColumn> logo + tagline + social icons
      <LinkColumn title="Product"> Features, Pricing, Changelog, Roadmap
      <LinkColumn title="Company"> About, Blog, Contact, Careers
      <LinkColumn title="Legal"> Privacy Policy, Terms of Service, Cookie Policy
    </div>
    <div> (border-t, pt-6, flex between)
      © 2026 Tacker
      Privacy · Terms · Cookies links
    </div>
  </div>
</footer>
```

**Social icons:** X/Twitter and Instagram as inline SVGs (18px, stroke 1.75, text-muted). Wrapped in 36px rounded containers with bg-subtle.

---

## Step 5: Assemble the page

### File: `app/page.tsx` (or `app/(marketing)/page.tsx` if using route groups)

```tsx
import { Navbar } from '@/components/homepage/Navbar';
import { Hero } from '@/components/homepage/Hero';
import { SocialProof } from '@/components/homepage/SocialProof';
import { Features } from '@/components/homepage/Features';
import { Showcase } from '@/components/homepage/Showcase';
import { HowItWorks } from '@/components/homepage/HowItWorks';
import { Testimonials } from '@/components/homepage/Testimonials';
import { FAQ } from '@/components/homepage/FAQ';
import { FinalCTA } from '@/components/homepage/FinalCTA';
import { Footer } from '@/components/homepage/Footer';

export default function HomePage() {
  return (
    <div className="bg-bg min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <Showcase />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
```

---

## Step 6: Barrel export

### File: `components/homepage/index.ts`

```tsx
export { Navbar } from './Navbar';
export { Hero } from './Hero';
export { SocialProof } from './SocialProof';
export { Features } from './Features';
export { Showcase } from './Showcase';
export { HowItWorks } from './HowItWorks';
export { Testimonials } from './Testimonials';
export { FAQ } from './FAQ';
export { FinalCTA } from './FinalCTA';
export { Footer } from './Footer';
export { PhoneMockup } from './PhoneMockup';
export { Reveal } from './Reveal';
export { useReveal } from './useReveal';
```

---

## Step 7: Responsive breakpoints

Apply these responsive patterns across all sections:

| Breakpoint | Width | Behavior |
|---|---|---|
| Base (mobile) | < 640px | Single column, stacked layouts, smaller type, 16px padding |
| `sm` | ≥ 640px | Minor adjustments, 2-col grids where applicable |
| `md` | ≥ 768px | 2-column grids, side-by-side layouts begin |
| `lg` | ≥ 1024px | Full desktop layout — Hero/Showcase two-column, 3-col card grids |
| `xl` | ≥ 1280px | Max container width reached, generous spacing |

**Key responsive rules:**
- Hero: `flex-col lg:flex-row` — phone stacks below copy on mobile
- Feature/HowItWorks/Testimonial grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Showcase: `flex-col lg:flex-row` — phone stacks below copy on mobile
- Navbar links: hidden on mobile, show hamburger menu (add `hidden md:flex` to links container, add a hamburger button that's `md:hidden`)
- Phone mockup: `hidden md:block` or scale down on mobile
- FAQ: stays single-column at all sizes (max-w-[720px])
- Social proof stats: `flex-wrap` handles mobile naturally, dividers hidden on mobile via `hidden sm:block`

---

## Step 8: Mobile navigation

The prototype doesn't include a mobile nav. Add one:

**Approach:** Sheet/drawer that slides in from the right.

```tsx
// Inside Navbar.tsx
const [menuOpen, setMenuOpen] = useState(false);

// Hamburger button (visible on mobile only)
<button className="md:hidden" onClick={() => setMenuOpen(true)}>
  {/* 3-line hamburger icon */}
</button>

// Mobile menu overlay
{menuOpen && (
  <div className="fixed inset-0 z-50 md:hidden">
    <div className="absolute inset-0 bg-primary/20" onClick={() => setMenuOpen(false)} />
    <div className="absolute right-0 top-0 h-full w-72 bg-card border-l border-default p-6">
      <button onClick={() => setMenuOpen(false)}>✕</button>
      <nav className="flex flex-col gap-6 mt-8">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it works</a>
        <a href="#faq">FAQ</a>
        <Button>Download Free</Button>
      </nav>
    </div>
  </div>
)}
```

---

## Step 9: Metadata

### File: update `app/layout.tsx` (or page-level metadata)

```tsx
export const metadata = {
  title: 'Tacker — Know exactly where your money goes',
  description: 'AI-powered expense and income tracker. Categorize spending, monitor cash flow, and calculate your saving rate — effortlessly. Free on iOS and Android.',
  openGraph: {
    title: 'Tacker — Know exactly where your money goes',
    description: 'AI-powered expense and income tracker with visual insights.',
    type: 'website',
    url: 'https://tacker.app',
  },
};
```

---

## Step 10: Verification checklist

After implementation, verify each item:

- [ ] All 10 sections render in correct order
- [ ] Scroll reveal animations fire on each section
- [ ] Navbar transitions from transparent to frosted on scroll
- [ ] Showcase tab switching works (Dashboard / Transactions / Insights)
- [ ] FAQ accordion opens/closes correctly (one at a time)
- [ ] All financial values use MonoValue component (DM Mono)
- [ ] All headings use font-heading (Sora)
- [ ] All body text uses font-body (DM Sans)
- [ ] No raw hex color values — all colors via Tailwind token classes
- [ ] No inline style objects — all styling via Tailwind classes
- [ ] Dark mode works (toggle data-theme on html and verify all sections)
- [ ] Responsive: test at 375px, 768px, 1024px, 1440px widths
- [ ] Mobile nav hamburger menu works
- [ ] All anchor links (#features, #how-it-works, #faq) scroll to correct section
- [ ] Focus rings visible on all interactive elements (tab through the page)
- [ ] No layout shifts or horizontal overflow on any viewport
- [ ] Page loads with correct fonts (check network tab for Google Fonts)

---

## File summary

| File | Action | Type |
|---|---|---|
| `components/homepage/useReveal.ts` | CREATE | Hook |
| `components/homepage/Reveal.tsx` | CREATE | Client component |
| `components/homepage/PhoneMockup.tsx` | CREATE | Component |
| `components/homepage/Navbar.tsx` | CREATE | Client component |
| `components/homepage/Hero.tsx` | CREATE | Client component |
| `components/homepage/SocialProof.tsx` | CREATE | Component |
| `components/homepage/Features.tsx` | CREATE | Component |
| `components/homepage/Showcase.tsx` | CREATE | Client component |
| `components/homepage/HowItWorks.tsx` | CREATE | Component |
| `components/homepage/Testimonials.tsx` | CREATE | Component |
| `components/homepage/FAQ.tsx` | CREATE | Client component |
| `components/homepage/FinalCTA.tsx` | CREATE | Component |
| `components/homepage/Footer.tsx` | CREATE | Component |
| `components/homepage/index.ts` | CREATE | Barrel export |
| `app/page.tsx` | MODIFY | Page composition |

**Total: 14 new files + 1 modified file.**

---

## Claude Code prompt

When feeding this to Claude Code, use:

> Read `docs/DESIGN_SYSTEM.md` for the design system specification and `docs/HOMEPAGE_INTEGRATION.md` for the homepage conversion plan. The visual reference is `tacker-homepage.jsx` — match its appearance and behavior exactly but implement using Tailwind classes and the component library in `components/ui/`. Follow every step in the integration plan. Create all 14 files listed in the file summary. Do not use inline styles — convert everything to Tailwind classes using the token config.

---

*Tacker.app Homepage Integration Plan · April 2026*
