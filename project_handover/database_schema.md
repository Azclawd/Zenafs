# Database Schema

The database is hosted on Supabase (PostgreSQL). The schema defines the core entities for the platform.

## Tables

### `public.profiles`
Stores user profile information, linked to `auth.users`.
-   `id` (uuid, PK, ref `auth.users`)
-   `role` (text: 'therapist' | 'client')
-   `full_name` (text)
-   `email` (text)
-   `avatar_url` (text)
-   `subscription_status` (text)

### `public.appointments`
Manages session bookings.
-   `id` (uuid, PK)
-   `therapist_id` (uuid, ref `profiles`)
-   `client_id` (uuid, ref `profiles`)
-   `start_time` (timestamp)
-   `end_time` (timestamp)
-   `status` ('pending', 'confirmed', 'cancelled', 'completed')
-   `payment_status` ('unpaid', 'paid', 'refunded')
-   `stripe_session_id` (text)

### `public.notes`
 clinical notes created by therapists.
-   `id` (uuid, PK)
-   `therapist_id` (uuid, ref `profiles`)
-   `client_id` (uuid, ref `profiles`)
-   `type` ('SOAP', 'DAP', 'General')
-   `content` (text/json)
-   `visibility` ('private', 'shared')

### `public.messages`
Real-time chat messages.
-   `id` (uuid, PK)
-   `sender_id` (uuid, ref `profiles`)
-   `receiver_id` (uuid, ref `profiles`)
-   `content` (text)
-   `is_read` (boolean)

### `public.community_groups`
Categories/Groups for the community.
-   `id` (uuid, PK)
-   `name` (text)
-   `category` (text)
-   `description` (text)

### `public.community_posts`
User-generated content in groups.
-   `id` (uuid, PK)
-   `author_id` (uuid, ref `profiles`)
-   `group_id` (uuid, ref `community_groups`)
-   `content` (text)
-   `gratitude_count` (int)

### `public.gratitude_tokens`
Likes/Appreciation mechanism.
-   `sender_id` (uuid)
-   `post_id` (uuid)

## Security
-   **Row Level Security (RLS)** is enabled on all tables.
-   Policies enforce:
    -   Users can only edit their own profile.
    -   Therapists can only see notes they created.
    -   Messages are only visible to sender and receiver.
    -   Community content is generally public/readable by auth users.
