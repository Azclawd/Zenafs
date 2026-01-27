# Debugging Report & Fix Plan

## Findings

### 1. Layout & Navigation (RESOLVED)
-   **Issue**: Public Navbar was appearing on Dashboard pages.
-   **Root Cause**: The root `src/app/layout.tsx` indiscriminately rendered `<Navbar />`.
-   **Fix Applied**:
    -   Moved public pages (Home, About, Contact, etc.) to a `(marketing)` route group.
    -   Created a dedicated `(marketing)/layout.tsx` for the public Navbar/Footer.
    -   Cleaned `src/app/layout.tsx` to be a pure shell.
    -   Auth-aware Navbar: The public navbar now shows "Dashboard" button if logged in.
-   **Evidence**:
    -   ![Layout Fixed](evidence/dashboard_layout_fixed.png) (Dashboard now shows correct sidebar and no public navbar)

### 2. Hydration Errors (RESOLVED)
-   **Issue**: "Prop `className` did not match" and "Extra attributes from the server" warnings.
-   **Root Cause**: Browser extensions (like Grammarly/LastPass) modifying the DOM before React hydrates.
-   **Fix Applied**: Added `suppressHydrationWarning` to the `<body>` tag.

### 3. Data Loading Error (406 Not Acceptable) (CRITICAL)
-   **Issue**: `GET /rest/v1/profiles` returns 406.
-   **Root Cause**: When a user signs up, they are created in `auth.users`, but **no corresponding row is created in `public.profiles`**. The frontend queries `profiles` expecting a single row, finds none, and fails.
-   **Missing Logic**: A Database Trigger is required to automatically create the profile row on user signup.
-   **Evidence**:
    -   ![406 Error](evidence/console_406_error.png) (Console shows 406 error on profile fetch)

### 4. "Missing" Features
-   **Status**: The code for Therapist Clients, Notes, and Booking flows **exists** in the codebase.
-   **Why invisible?**:
    -   Layout bugs (fixed) obscured navigation.
    -   Data errors (above) prevented the "Therapist" role from being recognized, likely defaulting the UI or crashing the auth state.

## Implementation Plan

### Step 1: Database Trigger (Immediate Action)
We must run a SQL migration to create the profile automatically.

```sql
-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_user_meta_data ->> 'role', 'client') -- Default to client if not specified
  );
  return new;
end;
$$;

-- Trigger the function on every new user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Step 2: Verification
1.  Sign up a NEW user.
2.  Verify `profiles` table has a row.
3.  Verify Dashboard loads without 406 error.
