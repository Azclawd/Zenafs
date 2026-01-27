# Debugging & Implementation Plan

## Problem Diagnosis
1.  **Layout Leak**: The public `Navbar` and `Footer` in `src/app/layout.tsx` are forcing themselves onto *every* page, including the Dashboard. This breaks the dashboard layout and obscures functionality.
2.  **Hydration Warning**: Extension-related mismatch (`data-new-gr-c-s-check-loaded`), harmless but clutters logs.
3.  **"Missing" Features**:
    -   **Code Exists**: Inspection confirms `therapist/clients` and `client/book` logic is written.
    -   **Visibility Blocked**: The layout bug likely prevents navigation or proper rendering.
    -   **Data Dependency**: Some features (Client List) depend on data (appointments) that might not exist yet.

## Phase 1: Architecture Repair (Priority: High)
*Goal: Fix the navigation bars and ensure generic pages work.*

- [ ] **Restructure Routes**:
    -   Create `src/app/(marketing)` route group.
    -   Move `page.tsx`, `about`, `contact`, `services`, `login`, `signup` into `(marketing)`.
- [ ] **Migrate Layouts**:
    -   Create `src/app/(marketing)/layout.tsx`: Move `<Navbar>` and `<Footer>` here.
    -   Clean `src/app/layout.tsx`: Keep only `<html>`, `<body>`, and `<AuthProvider>`.
- [ ] **Fix Hydration**: Add `suppressHydrationWarning` to `<body>` in root layout.

## Phase 2: Feature Verification & Polish
*Goal: Ensure the "missing" features are actually usable.*

### Therapist Flow
- [ ] **Client List**: Verify it handles "0 clients" gracefully (it currently does). Consider adding a "Invite Client" button if no clients exist.
- [ ] **Note Taking**: Inspect `therapist/clients/[id]/page.tsx` (or similar) to ensure the Note UI exists.
- [ ] **Schedule**: Verify `dashboard/sessions` page.

### Client Flow
- [ ] **Booking**: The `client/book` page exists with Stripe logic.
    -   **Task**: Check `api/stripe/checkout` route handler existence.
- [ ] **My Journey**: Check `dashboard/client/journey` content.

### Shared Features
- [ ] **Chat**: Inspect `dashboard/client/chat` and `dashboard/therapist/chat` (likely same component).
    -   **Task**: Verify Realtime subscription logic.
- [ ] **Community**: Inspect `dashboard/community`.

## Execution Order
1.  **Refactor Layouts** immediately to clear visual obstructions.
2.  **Manual Verification**: Click through the Sidebar links (now visible) to confirm pages load.
3.  **Fix/Build**: If a page is truly empty or broken, implement it based on the **Handover Architecture**.
