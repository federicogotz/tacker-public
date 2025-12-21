# 💠 Tacker

**A personal finance tracker built to keep finances undercontrol with simplicity.**

https://tacker.app/

<img width="1912" height="988" alt="Screenshot 2025-12-21 at 21 00 23" src="https://github.com/user-attachments/assets/60db26b6-272d-4761-a6f7-b0bc3db8daf8" />


## 📖 The Story

In 2020, I created an Excel spreadsheet to track my expenses. It worked beautifully for me - just 5 minutes per week to maintain complete financial clarity. Friends asked to use it, but sharing meant exporting copies and explaining complex formulas. That friction sparked an idea: what if I could deliver the same value through an intuitive app that anyone could use?

Tacker was born from this philosophy: **financial tracking should take 5 minutes per week, not hours.**

This project represents my journey from concept to shipped product - a dual-platform financial tracking application (web + iOS) that combines thoughtful product design with modern technical architecture.

---

## ✨ What Makes Tacker Different

### The "5 Minutes Per Week" Philosophy

Every product decision starts with one question: *"Does this save the user time or cost them time?"*

- **Immediate value**: Transactions display chronologically by default - no filters needed to see your latest activity
- **AI-powered categorization**: Receipt scanning extracts data automatically - no manual entry required
- **Smart defaults**: Date defaults to today, categories pre-populate, recurring entries remember your patterns
- **One-click insights**: Dashboard shows spending trends without needing to generate reports

### Features Built for Real Users

**Expense Tracking**
- Manual entry with smart categorization
- OCR receipt scanning (Tesseract.js for web, Gemini Flash API for iOS)
- CSV bulk import for migrating from other tools
- Recurring expense tracking (weekly/monthly)

**Income Management**
- Full income tracking with 8 categories
- Recurring income entries
- Net income calculation

**Financial Insights**
- Real-time dashboard with key metrics
- Monthly cash flow analysis (income vs. expenses)
- 12-month saving rate calculation
- Category breakdowns and spending trends
- Sankey diagrams for cash flow visualization

**Multi-platform Experience**
- Responsive web application
- Native iOS app (currently in TestFlight beta)
- Shared Supabase backend for seamless sync
- Multi-language support (English, Italian, Spanish)

---

## 🏗️ Technical Architecture

### High-Level Overview

```
┌─────────────────┐         ┌──────────────────┐
│   Web Client    │         │   iOS Client     │
│  (React + TS)   │         │ (Capacitor + TS) │
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │    REST API + Auth        │
         └───────────┬───────────────┘
                     │
         ┌───────────▼───────────┐
         │   Supabase Backend    │
         │                       │
         │  • PostgreSQL DB      │
         │  • Authentication     │
         │  • Row-Level Security │
         │  • Edge Functions     │
         │  • Real-time Sync     │
         └───────────────────────┘
```

### Tech Stack

**Frontend (Web)**
- React 18 + TypeScript - Type-safe component architecture
- Vite - Lightning-fast builds and HMR
- TanStack Query - Server state management
- Tailwind CSS + shadcn/ui - Design system
- Recharts - Data visualization
- React Router - Client-side routing

**Frontend (iOS)**
- Capacitor - Native iOS bridge
- Same React codebase as web with platform-specific optimizations
- Native iOS UI patterns (safe area, gestures)

**Backend & Infrastructure**
- Supabase - BaaS platform
  - PostgreSQL with Row-Level Security
  - Built-in authentication (email, Google OAuth)
  - Real-time subscriptions
  - Edge Functions for AI processing
- Gemini Flash API - AI-powered receipt scanning (free tier for sustainable economics)

**Database Schema**
```sql
expenses
├── id (uuid, primary key)
├── user_id (uuid, foreign key → auth.users)
├── title (text)
├── amount (decimal)
├── category (text)
├── date (date)
├── recurring_period (enum: week | month | null)
├── created_at (timestamp)
└── updated_at (timestamp)

income
├── id (uuid, primary key)
├── user_id (uuid, foreign key → auth.users)
├── title (text)
├── amount (decimal)
├── category (text)
├── date (date)
├── recurring_period (enum: week | month | null)
├── created_at (timestamp)
└── updated_at (timestamp)

+ Row-Level Security policies ensuring users only access their own data
+ Indexes on user_id and date for query performance
```

### Architecture Decisions & Rationale

**Separate Repositories Over Monorepo**
- Simpler deployment pipelines (web → Netlify, iOS → TestFlight)
- Clear separation of concerns between platforms
- Easier dependency management (no cross-platform conflicts)
- Future flexibility for independent scaling

**Supabase Over Custom Backend**
- Built-in authentication and RLS security
- Zero server maintenance
- Real-time capabilities out of the box
- Free tier supports sustainable zero-cost model

**Gemini Flash API for AI**
- Free tier: 15 requests/minute, 1500/day
- Supports the "5 free AI uploads" freemium model
- Low latency, high accuracy for receipt scanning

**Performance Optimizations**
- Code splitting: 88% bundle size reduction (1.2MB → 150KB initial load)
- Lazy loading routes and components
- Optimistic updates for perceived performance
- Image compression for receipt uploads

---

## 🔧 Development Approach

### Phase-Based Development Methodology

Complex features are broken into 15-25 minute phases to maintain code quality and prevent errors when working with AI coding assistants.

**Example: Budget Feature Implementation**

**Phase 1: Structure & Navigation (15 min)**
- Empty states and page routing
- Basic component scaffolding
- Navigation integration

**Phase 2: Core Functionality (20 min)**
- Database queries and mutations
- Form handling and validation
- Data persistence

**Phase 3: Visual Polish (15 min)**
- Charts and data visualization
- Responsive design refinements
- Loading states and transitions

**Phase 4: Optimization (20 min)**
- Performance profiling
- Query optimization
- Error boundary implementation

This methodology proved especially effective for:
- iOS native integration
- Google authentication flow
- Multi-language implementation
- Performance optimization work

### Key Learnings

**1. User Experience Trumps Technical Elegance**
- Originally built elaborate filter systems - users just wanted to see recent transactions
- Scrapped complex budget forecasting - users preferred simple month-over-month comparisons
- Lesson: Ship the simplest version that solves the core problem

**2. AI Features as Differentiators**
- Manual expense entry has high friction
- Receipt scanning creates "aha moment" for users
- Free tier with limited AI creates natural upgrade path
- Lesson: AI isn't just a feature, it's the product moat

**3. Performance is a Feature**
- 88% bundle reduction directly improved mobile conversion
- Lazy loading reduced perceived load time from 3s to <1s
- Lesson: Users judge quality by speed

**4. Systematic Debugging Over Quick Fixes**
- Expense editing bug required state management audit, not surface patches
- Root cause analysis saved hours of future debugging
- Lesson: Invest time in understanding, not just fixing

---

## 📁 Project Structure

```
tacker/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── ExpensesTable.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useExpenses.ts
│   │   ├── useIncome.ts
│   │   └── useDataRefresh.ts
│   ├── lib/                # Utilities
│   │   ├── supabaseExpenseService.ts
│   │   ├── supabaseIncomeService.ts
│   │   └── currency.ts
│   ├── pages/              # Route components
│   ├── contexts/           # React contexts
│   └── types/              # TypeScript types
├── supabase/
│   └── schema.sql          # Database schema
└── public/
    └── _redirects          # Netlify routing

tacker-ios/
├── src/                    # Shared React code
├── ios/                    # Native iOS project
├── capacitor.config.ts     # Capacitor configuration
└── ...
```

---

## 🎯 What I Learned Building Tacker

### Product Development
- **Start with philosophy, not features**: The "5 minutes per week" principle guided every decision
- **Build for one person first**: My Excel system proved product-market fit before writing code
- **AI as product moat**: Manual entry is commodity, AI inport and categorization is differentiation

### Technical Growth
- **TypeScript mastery**: Strict mode enforcement caught bugs before production
- **State management**: TanStack Query simplified complex async state
- **Performance optimization**: Bundle splitting, lazy loading, code profiling
- **Cross-platform development**: Capacitor for native iOS from React codebase

### Process & Methodology
- **Phase-based development**: 15-25 min phases maintain quality with AI tools
- **Systematic debugging**: Root cause analysis over quick fixes
- **Architecture simplicity**: Separate repos > monorepo for this use case

---

## 🛠️ Built With

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Supabase](https://supabase.com/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Recharts](https://recharts.org/) - Data visualization
- [Capacitor](https://capacitorjs.com/) - Native iOS bridge
- [Tesseract.js](https://tesseract.projectnaptha.com/) - OCR (web)
- [Google Gemini](https://ai.google.dev/) - AI receipt scanning (iOS)


---

## 🙏 Acknowledgments

This project exists because of:
- My 2020 Excel spreadsheet that proved the concept
- Friends who wanted to use my tracking system
- The incredible open-source community behind React, Supabase, and the modern web stack

---

**Built with ❤️ 
