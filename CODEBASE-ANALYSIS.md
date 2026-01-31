# Zenafs - Codebase Analysis

**Analyzed by:** Tim 🦊  
**Date:** 2026-01-27  
**Status:** Deep Dive Complete (Code Review)

---

## 1. Project Overview

**Purpose:** Mental health platform connecting clients with therapists, with community support features.

**Core Users:**
- **Therapists:** Client management, clinical notes (SOAP/DAP), appointments
- **Clients:** Book sessions, chat with therapist, community participation

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router) + React 19 |
| UI | Tailwind CSS v4 + Custom Components |
| Animations | Framer Motion |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Payments | Stripe (checkout + webhooks started) |
| SSR | @supabase/ssr for server-side auth |

---

## 3. File Structure

```
src/
├── app/
│   ├── (marketing)/           # Public pages (home, about, login, signup)
│   ├── dashboard/
│   │   ├── therapist/         # Therapist dashboard pages
│   │   ├── client/            # Client dashboard pages
│   │   ├── community/         # Community features
│   │   └── settings/          # User settings
│   ├── api/stripe/            # Stripe checkout + webhook routes
│   └── actions/               # Server actions (contact, newsletter)
├── components/
│   ├── ui/                    # Basic UI (Button, Card, Input, Marquee)
│   ├── sections/              # Marketing page sections
│   ├── layout/                # Navbar, Footer
│   ├── dashboard/             # Dashboard-specific (NoteEditor, Sidebar)
│   ├── chat/                  # ChatWindow component
│   └── community/             # Feed component
├── contexts/
│   └── AuthContext.tsx        # Auth state management
├── lib/database/
│   ├── queries.ts             # Read operations
│   └── mutations.ts           # Write operations
└── middleware.ts              # Route protection
```

---

## 4. Database Schema

| Table | Purpose | Status |
|-------|---------|--------|
| `profiles` | User accounts with role (therapist/client) | ✅ Defined |
| `notes` | Clinical notes (SOAP/DAP/General) | ✅ Defined |
| `appointments` | Session bookings with payment status | ✅ Defined |
| `messages` | Real-time chat between users | ✅ Defined |
| `community_groups` | Community categories (Mothers, Anxiety, etc.) | ✅ Defined |
| `community_posts` | User posts in community | ✅ Defined |
| `gratitude_tokens` | Appreciation tokens for posts | ✅ Defined |

**RLS Policies:** All tables have RLS enabled with appropriate policies.

**Realtime:** Enabled on `messages` table.

---

## 5. Current Implementation Status

### ✅ Completed
- Marketing pages (home, about, services, contact)
- Basic layout (Navbar, Footer, Sidebar)
- Auth context structure
- Database schema defined
- Stripe API routes scaffolded
- Chat component shell
- Note editor component shell

### 🟡 Partially Implemented
- Dashboard routing (structure exists, logic minimal)
- Role-based redirection (needs work)
- Sidebar dynamic rendering

### ❌ Not Implemented
- Full auth flow (signup with role selection)
- Therapist dashboard functionality
- Client booking flow
- Stripe checkout completion
- Real-time chat functionality
- Community feed interactivity
- Note taking (SOAP/DAP forms)
- Appointment management

---

## 6. Identified Issues

### 🔴 Critical Issues

| Issue | Description | Impact |
|-------|-------------|--------|
| **Logic Missing** | UI exists but no business logic | App non-functional |
| **Auth Incomplete** | Role selection in signup not wired | Users can't register properly |
| **No Supabase Connection Verified** | Need to test actual DB connection | May not work at all |

### 🟡 Medium Issues

| Issue | Description | Impact |
|-------|-------------|--------|
| **UI Components Limited** | Only 4 basic UI components | Need more shadcn/ui |
| **No Form Validation** | No Zod/React Hook Form | Poor UX, data quality |
| **Stripe Not Tested** | Webhook/checkout routes exist but untested | Payments won't work |

### 🟢 Minor Issues

| Issue | Description | Impact |
|-------|-------------|--------|
| **Tailwind v4** | Newer version, some patterns different | Learning curve |
| **React 19** | Cutting edge, may have bugs | Compatibility |

---

## 7. Strengths

- ✅ Clean project structure (Next.js App Router)
- ✅ Only 2 migrations (clean schema)
- ✅ Good database design with RLS
- ✅ Framer Motion for animations
- ✅ Marketing pages look complete
- ✅ Separation of concerns (queries/mutations)

---

## 8. Recommended Approach

### Phase 1: Foundation & Auth (Week 1)
1. **Middleware** — Protect `/dashboard` routes properly
2. **Auth Flow** — Complete signup with role selection
3. **Role Redirection** — Therapist → therapist dashboard, Client → client dashboard
4. **Sidebar** — Dynamic items based on role

### Phase 2: Core Features (Week 2-3)
1. **Therapist Dashboard** — Overview, client list, note taking
2. **Client Dashboard** — Therapist discovery, journey view
3. **Note Taking UI** — SOAP/DAP forms with validation

### Phase 3: Appointments & Payments (Week 3-4)
1. **Booking UI** — Calendar slot selection
2. **Stripe Integration** — Complete checkout flow
3. **Session Management** — Upcoming/past sessions

### Phase 4: Community & Chat (Week 4-5)
1. **Chat Interface** — Real-time messaging
2. **Community Feed** — Groups, posts, gratitude tokens

### Phase 5: Polish (Week 5-6)
1. **Profile Settings**
2. **Error Handling**
3. **Loading States**
4. **SEO & Metadata**

---

## 9. Browser Testing Required

**Test Accounts Needed:**
- Account 1: Therapist flows (dashboard, notes, clients)
- Account 2: Client flows (booking, chat, community)

**Flows to Test:**
- [ ] Therapist signup/login
- [ ] Client signup/login
- [ ] Role-based dashboard routing
- [ ] Marketing pages load correctly
- [ ] Supabase connection works

---

## 10. Questions for Az

1. Is the app currently deployed anywhere?
2. Do you have Supabase project credentials for testing?
3. Is Stripe in test mode with test keys available?
4. Any specific design references for the dashboards?
5. Priority: Build new features or fix existing scaffolding first?

---

*Analysis complete. Awaiting Az approval before proceeding.*
