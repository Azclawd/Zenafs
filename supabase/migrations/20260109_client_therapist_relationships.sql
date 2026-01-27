-- Create client_therapist_relationships table
-- This table manages the primary relationship between a client and their assigned therapist

create table if not exists public.client_therapist_relationships (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  therapist_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('active', 'inactive', 'pending')) default 'active',
  assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text, -- Internal notes about the relationship
  unique(client_id) -- Each client can only have one active therapist at a time
);

-- Enable RLS
alter table public.client_therapist_relationships enable row level security;

-- Policies for client_therapist_relationships
-- Clients can view their own therapist assignment
create policy "Clients can view their own therapist assignment" on public.client_therapist_relationships
  for select using (auth.uid() = client_id);

-- Therapists can view their assigned clients
create policy "Therapists can view their assigned clients" on public.client_therapist_relationships
  for select using (auth.uid() = therapist_id);

-- Only therapists can create new relationships (assign themselves to clients)
create policy "Therapists can create relationships" on public.client_therapist_relationships
  for insert with check (auth.uid() = therapist_id);

-- Therapists can update relationship status
create policy "Therapists can update relationships" on public.client_therapist_relationships
  for update using (auth.uid() = therapist_id);

-- Add index for faster lookups
create index if not exists client_therapist_relationships_client_id_idx on public.client_therapist_relationships(client_id);
create index if not exists client_therapist_relationships_therapist_id_idx on public.client_therapist_relationships(therapist_id);

-- Function to get a client's active therapist
create or replace function public.get_client_therapist(client_user_id uuid)
returns table (
  therapist_id uuid,
  full_name text,
  email text,
  avatar_url text,
  specialty text,
  status text
)
language plpgsql
security definer
as $$
begin
  return query
  select
    p.id as therapist_id,
    p.full_name,
    p.email,
    p.avatar_url,
    p.specialty,
    ctr.status
  from public.client_therapist_relationships ctr
  join public.profiles p on p.id = ctr.therapist_id
  where ctr.client_id = client_user_id
    and ctr.status = 'active'
  limit 1;
end;
$$;

-- Add specialty column to profiles if it doesn't exist
alter table public.profiles add column if not exists specialty text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists phone text;
