-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('therapist', 'client')) default 'client',
  full_name text,
  avatar_url text,
  subscription_status text default 'inactive',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create notes table
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  therapist_id uuid references public.profiles(id) not null,
  client_id uuid references public.profiles(id) not null,
  title text,
  content text, -- JSON or HTML content
  type text check (type in ('SOAP', 'DAP', 'General')) default 'General',
  visibility text check (visibility in ('private', 'shared')) default 'private',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notes enable row level security;

-- Policies for notes
create policy "Therapists can view all notes they created." on public.notes
  for select using (auth.uid() = therapist_id);

create policy "Therapists can insert notes." on public.notes
  for insert with check (auth.uid() = therapist_id);

create policy "Therapists can update their own notes." on public.notes
  for update using (auth.uid() = therapist_id);

create policy "Clients can view shared notes assigned to them." on public.notes
  for select using (auth.uid() = client_id and visibility = 'shared');

-- Create appointments table
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  therapist_id uuid references public.profiles(id) not null,
  client_id uuid references public.profiles(id) not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text check (status in ('pending', 'confirmed', 'cancelled', 'completed')) default 'pending',
  payment_status text check (payment_status in ('unpaid', 'paid', 'refunded')) default 'unpaid',
  stripe_session_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.appointments enable row level security;

-- Policies for appointments
create policy "Users can view their own appointments." on public.appointments
  for select using (auth.uid() = therapist_id or auth.uid() = client_id);

create policy "Users can insert appointments." on public.appointments
  for insert with check (auth.uid() = client_id); -- Assuming clients book

-- Create messages table (Realtime Chat)
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_read boolean default false
);

-- Enable RLS for messages
alter table public.messages enable row level security;

-- Policies for messages
create policy "Users can view their own messages." on public.messages
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can insert messages." on public.messages
  for insert with check (auth.uid() = sender_id);

-- Enable Realtime for messages
alter publication supabase_realtime add table public.messages;

-- Create community_groups table
create table public.community_groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text not null, -- e.g., 'Mothers', 'Fitness', 'Anxiety'
  icon text, -- Lucide icon name
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for community_groups
alter table public.community_groups enable row level security;

create policy "Community groups are viewable by everyone." on public.community_groups
  for select using (true);

-- Create community_posts table
create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  author_id uuid references public.profiles(id) not null,
  group_id uuid references public.community_groups(id), -- Optional, if null it's on the main feed
  gratitude_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for community_posts
alter table public.community_posts enable row level security;

create policy "Community posts are viewable by everyone." on public.community_posts
  for select using (true);

create policy "Users can insert their own posts." on public.community_posts
  for insert with check (auth.uid() = author_id);

create policy "Users can update their own posts." on public.community_posts
  for update using (auth.uid() = author_id);

-- Create gratitude_tokens table
create table public.gratitude_tokens (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null, -- The author of the post
  post_id uuid references public.community_posts(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(sender_id, post_id) -- One token per post per user
);

-- Enable RLS for gratitude_tokens
alter table public.gratitude_tokens enable row level security;

create policy "Gratitude tokens are viewable by everyone." on public.gratitude_tokens
  for select using (true);

create policy "Users can give gratitude tokens." on public.gratitude_tokens
  for insert with check (auth.uid() = sender_id);


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
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
