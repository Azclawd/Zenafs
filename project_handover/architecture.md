# Architecture & Design

## Technology Stack

### Frontend
-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4, `clsx`, `tailwind-merge`
-   **Components**: Custom components using Radix UI (presumed via `react-slot`) and Lucide Icons.
-   **Animations**: Framer Motion
-   **Date Handling**: date-fns

### Backend & Database
-   **Platform**: Supabase
    -   **Auth**: Supabase Auth (JWT)
    -   **Database**: PostgreSQL
    -   **Realtime**: Supabase Realtime (for Chat)
    -   **Storage**: Supabase Storage (for avatars, attachments)
-   **Payments**: Stripe API

## Application Layer

### Route Structure
```
src/app/
├── (auth)/             # Login/Signup/Reset Password
├── api/                # Route Handlers (Stripe webhooks, etc.)
├── dashboard/          # Protected Routes
│   ├── layout.tsx      # Sidebar & Auth Check
│   ├── page.tsx        # Overview (Role-redirected)
│   ├── therapist/      # Therapist-specific views
│   ├── client/         # Client-specific views
│   ├── community/      # Shared Community views
│   ├── sessions/       # Appointments view
│   └── settings/       # Profile settings
├── (marketing)/        # Public pages (Home, About, Contact)
```

### Authentication Flow
1.  **Sign Up/In**: Users sign up via Supabase Auth.
2.  **Profile Creation**: Trigger on auth event creates a `public.profiles` row with role (`client` or `therapist`).
3.  **Session Management**: handled by `@supabase/ssr` cookies.
4.  **Protection**: Middleware (to be implemented) or Layout checks ensure user is logged in and has correct role for specific routes.

### Design System
-   **Theme**: Serene, mental health focused.
-   **Colors**: `zen-*` palette (likely soft greens/blues).
-   **Typography**: Serif for headings (trust/warmth), Sans for UI.
-   **Components**: Located in `src/components/ui`. Modular, atomic design.

## Integration Points
-   **Stripe**:
    -   Checkout Sessions for booking.
    -   Webhooks to update `appointments` table status.
-   **Supabase Realtime**:
    -   Subscribed to `messages` table for live chat.
