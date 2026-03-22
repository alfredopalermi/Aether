-- ── 001_initial.sql ──────────────────────────────────────────────────────
-- Run this in your Supabase project: SQL Editor → New query → paste → Run

-- Tools table
create table if not exists public.tools (
  id          serial primary key,
  name        text not null,
  slug        text not null unique,
  tagline     text not null,
  description text not null,
  category    text not null,
  pricing     text not null check (pricing in ('Free','Freemium','Paid')),
  featured    boolean default false,
  website     text not null,
  logo        text not null default '◎',
  use_cases   text[] default '{}',
  pros        text[] default '{}',
  cons        text[] default '{}',
  tags        text[] default '{}',
  added_at    date not null default current_date,
  editorial   text,
  created_at  timestamptz default now()
);

-- Votes table (one row per tool, atomic increment)
create table if not exists public.votes (
  tool_slug text primary key references public.tools(slug) on delete cascade,
  count     integer default 0
);

-- Public read access (no auth needed to browse tools)
alter table public.tools enable row level security;
alter table public.votes enable row level security;

create policy "tools_public_read" on public.tools for select using (true);
create policy "votes_public_read" on public.votes for select using (true);
create policy "votes_public_update" on public.votes for update using (true);
create policy "votes_public_insert" on public.votes for insert with check (true);

-- Helper function: increment vote atomically
create or replace function increment_vote(p_slug text)
returns integer
language plpgsql
as $$
declare
  new_count integer;
begin
  insert into votes (tool_slug, count) values (p_slug, 1)
  on conflict (tool_slug) do update set count = votes.count + 1
  returning count into new_count;
  return new_count;
end;
$$;

-- Helper function: decrement vote atomically
create or replace function decrement_vote(p_slug text)
returns integer
language plpgsql
as $$
declare
  new_count integer;
begin
  update votes set count = greatest(0, count - 1)
  where tool_slug = p_slug
  returning count into new_count;
  return coalesce(new_count, 0);
end;
$$;
