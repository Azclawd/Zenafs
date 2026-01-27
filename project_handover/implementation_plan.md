# Implementation Plan & Tasks

This document outlines the roadmap for completing the Zenafs platform.

## Phase 1: Foundation & Authentication
- [ ] **Middleware Setup**: Implement `middleware.ts` to protect `/dashboard` routes and redirect unauthenticated users to `/login`.
- [ ] **Auth Context**: Ensure a robust AuthProvider (client-side) makes user session and *profile data* (role) available globally.
- [ ] **Role-Based Redirection**: Modify `/dashboard/page.tsx` to redirect:
    -   Role `therapist` -> `/dashboard/therapist`
    -   Role `client` -> `/dashboard/client` (or default view)
- [ ] **Sidebar Dynamic Rendering**: Update `src/app/dashboard/layout.tsx` to show different sidebar items based on the user's role.

## Phase 2: Core Dashboard Features
### Therapist Dashboard
- [ ] **Overview Widget**: Show upcoming sessions, recent client activity.
- [ ] **Client List**: View assigned clients.
- [ ] **Note Taking UI**: Create form for SOAP/DAP notes.
    -   Select Client -> New Note -> Form -> Save to `notes` table.

### Client Dashboard
- [ ] **Therapist Discovery**: View list of available therapists (if not assigned).
- [ ] **My Journey**: View shared notes/resources from therapist.

## Phase 3: Appointments & Payments
- [ ] **Booking UI**: Calendar view to select slots.
- [ ] **Stripe Integration**:
    -   Create Payment Intent API route.
    -   Frontend checkout flow.
    -   Webhook listener to update `appointments` table on success.
- [ ] **Session Management**: Lists for "Upcoming", "Past" sessions.

## Phase 4: Community & Chat
- [ ] **Chat Interface**:
    -   Build `ChatWindow` component.
    -   Subscribe to Supabase Realtime on `messages` table.
    -   Implement "Send" functionality.
- [ ] **Community Feed**:
    -   List Groups (`community_groups`).
    -   Feed View (`community_posts`).
    -   Create Post Modal.
    -   Gratitude Token logic (optimistic UI update).

## Phase 5: Polish & Launch
- [ ] **Profile Settings**: standard change password/avatar/bio forms.
- [ ] **Error Handling**: Graceful error states (Toast notifications).
- [ ] **Loading States**: Skeletons for dashboard widgets.
- [ ] **SEO & Metadata**: Update titles and descriptions.

## Instructions for Execution
1.  Read `architecture.md` to understand context.
2.  Follow the **Database Schema** strictly.
3.  Use existing UI components in `src/components/ui` where possible to maintain design consistency.
4.  Write minimal code to achieve each task, verify, then move to next.
