# Zenafs — State-of-the-Art Roadmap & Implementation Plan

*Owner: Tim (Clawdbot)*
*Last updated: 2026-01-27*

Zenafs is a dual-sided therapy platform (Therapist + Client) with marketplace DNA and a serenity-first UX.

---

## North Star
**Seamless therapist-client experience** with:
- minimal admin for therapists
- clear, safe client visibility
- calm, airy UI (plants + cloud motion, soft transitions)
- rock-solid privacy, security, and auditability

---

## Non‑negotiables (Quality Gates)
1) **Security**: RLS on all tables, least-privilege, no secrets in code.
2) **Privacy UX**: explicit visibility controls (private vs shared), safe defaults.
3) **Performance**: dashboard interactions feel instant; meaningful skeletons.
4) **Design system**: consistent spacing, typography, motion patterns.
5) **Instrumentation**: logs + analytics events for key flows.

---

## Current Known State (from repo + schema)
**Exists:** auth, middleware protection, profiles table, notes/appointments/messages/community schema, therapist dashboard (nice UI), multiple dashboard routes.
**Needs completion:** dashboard flows, sessions/appointments management, therapist notes workflow, client viewing, rewards/uplift layer.

---

## Product Architecture (recommended)
### Roles
- Therapist
- Client

### Core Modules
1) **Dashboard** (role-based home)
2) **Sessions / Appointments** (booking, calendar, statuses)
3) **Notes** (therapist authoring, templates, sharing)
4) **Client Journey** (goals, progress, milestones)
5) **Messaging** (secure chat, safe notifications)
6) **Payments** (Stripe, receipts, subscription status)
7) **Community** (anonymous hub – later gate)

---

## Data Model — Required Additions / Hardening
> We already have `profiles`, `notes`, `appointments`, `messages`.

### 1) Notes: make it first‑class and therapist‑friendly
- `note_templates` (SOAP/DAP/custom blocks)
- `note_versions` (history / audit)
- `note_shares` (explicit share events, optional expiry)
- Optional: `note_tags`

### 2) Client uplift / rewards
- `affirmations` (system/therapist authored)
- `milestones` (client achievements)
- `kudos` or `kind_gestures` (therapist → client)

### 3) Sessions
- Ensure `appointments` supports:
  - session_type, duration, modality (video/phone/in-person)
  - therapist_notes_link (to open notes quickly)
  - outcome markers (completed, cancelled, no-show)

### RLS rules
- Therapist can read/write their own notes
- Client can only read **shared** notes linked to them
- Share events logged
- Messages limited to sender/receiver only

---

## UX System (Serenity-first)
### Visual language
- Airy spacing, warm neutrals, soft greens/blues
- **Plant + cloud animations**:
  - very slow parallax drift in headers
  - subtle gradient “breathing” backgrounds
  - gentle fade/stagger on page load

### Interaction patterns
- Pill tabs
- Satisfying toggles (spring)
- Calm skeletons
- “Beam” accents for primary CTA

---

## Implementation Plan (Days)

### Day 1 — Audit + Finish Dashboard Skeletons
- Normalize layouts (dashboard shell, typography, spacing)
- Complete **sessions management page** UI states:
  - empty, loading, error, populated
  - filtering (today/week/status)
  - action menus (confirm/cancel/complete)
- Add calm motion system (fade in, stagger) + cloud header component

### Day 2 — Appointments / Sessions Engine
- Build therapist appointment list + detail drawer
- Status transitions + permissions
- Calendar view (simple week view first; upgrade later)
- Ensure DB queries + RLS correct

### Day 3 — Notes v1 (Therapist authoring)
- Notes editor:
  - template picker (SOAP/DAP/General)
  - autosave
  - attach to a client + optionally a session
  - visibility toggle (private/shared)
- Notes list per client + quick search

### Day 4 — Client Notes View (Shared-only, safe UX)
- Client-facing notes page:
  - “what your therapist shared” timeline
  - clear disclaimers + interpretation helpers
  - optional “reflect back” prompt (journaling)

### Day 5 — Uplift Layer v1
- Therapist can send:
  - a “kind gesture” (short note)
  - an affirmation (selected from library)
  - a milestone unlock (manual or rules-based)
- Client receives:
  - calm notification + “save to your toolbox”

### Day 6 — Messaging + Notifications Polish
- Tie sessions → message threads
- Notification preferences (quiet hours)
- Delivery reliability checks

### Day 7 — Payments + Subscription Hooks
- Stripe session flow polish
- `subscription_status` enforcement in UI
- Therapist earnings placeholders (v1)

---

## Definition of Done (v1)
Therapist:
- can manage sessions
- can write notes fast
- can share notes safely
- can uplift clients with gentle gestures

Client:
- can view shared notes clearly
- can track journey/milestones
- feels calm and supported in the UI

---

## Backlog (after v1)
- Scheduling integration (Cal.com) or custom availability engine
- Video calls (Daily/Twilio) w/ privacy review
- Anonymous community hub (moderation + crisis flows)
- Therapist marketplace discovery
- Advanced analytics + outcomes tracking

