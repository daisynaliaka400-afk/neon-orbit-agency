# Implementation Plan: MetaOrbit Agencies (Client-Side Prototype)

This plan outlines the creation of the MetaOrbit Agencies platform. **Note: As per session constraints, no server-side database or Supabase will be used.** Persistence will be simulated via `localStorage` and all logic will reside in the frontend.

## 1. Scope & Strategy
- **Goal:** Build a mobile-first, glassmorphic MIS Agency platform.
- **Aesthetic:** Dark Mode (#121212), semi-transparent cards, neon accents (Cyan, Gold, Purple).
- **Persistence:** LocalStorage for profiles, transactions, and settings.
- **Auth:** Mock authentication system using LocalStorage.

## 2. Affected Areas
- **Styling:** Tailwind CSS + Framer Motion for glassmorphism and animations.
- **Components:** Shadcn UI base components, custom glassmorphic wrappers.
- **State Management:** React state + LocalStorage for data persistence.
- **Navigation:** Bottom bar for users, Floating Action Button for admin.

## 3. Implementation Phases

### Phase 1: Foundation & Theme (Architect / Frontend)
- Configure Tailwind with specific colors: Charcoal (#121212), Cyan (Fox), Gold (Simba), Purple (Ndovu).
- Setup Lucide icons and Framer Motion.
- Create common Glassmorphic Card component.

### Phase 2: Mock Data & Storage Utility (Frontend)
- Implement `storage.ts` to handle CRUD operations on `localStorage` for:
    - `profiles`
    - `transactions`
    - `tasks`
- Initialize default data (Admin user, dummy tasks).

### Phase 3: Public & Auth Flow (Frontend)
- **Landing Page:** Hero section, neon typography, trust metrics.
- **Registration:** Form with referral code logic (URL param check).
- **Activation Screen:** Package cards (Fox, Simba, Ndovu) + Payment form (Lipa na M-Pesa display).

### Phase 4: Authenticated Dashboard (Frontend)
- **Layout:** Bottom navigation bar.
- **Overview:** Balance/Profit/Team cards.
- **Earning Hub:**
    - YouTube/TikTok list with timers.
    - Trivia (5 questions/day logic).
    - Spin & Win component.
- **Referral Section:** Copy-link functionality.

### Phase 5: Admin Dashboard (Frontend)
- **Activation Queue:** List pending transactions from LocalStorage.
- **Approval Logic:** Update user status, tier, and award referral commission (10%).
- **Payouts Tab:** View withdrawal requests.
- **Global Settings:** Toggle withdrawal availability.

### Phase 6: Refinement & Transitions (Quick Fix / Frontend)
- Add Framer Motion transitions between tabs.
- Final CSS polish for neon glow effects.
- Ensure mobile-first responsiveness.

## 4. Sequencing Constraints
- Phase 2 (Storage) must be completed before functional pages in Phase 3-5.
- Admin logic (Phase 5) is required to "activate" accounts created in Phase 3.

## 5. Assigned Specialists
- **frontend_engineer:** Primary owner for all phases.
- **quick_fix_engineer:** Polishing CSS and fixing minor UI bugs during Phase 6.
