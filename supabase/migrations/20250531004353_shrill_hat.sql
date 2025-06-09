-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Drop existing tables if they exist (in reverse order of dependencies)
drop table if exists public.user_achievement cascade;
drop table if exists public.gamification_level cascade;
drop table if exists public.user_progress cascade;
drop table if exists public.activity_attempt cascade;
drop table if exists public.student_class cascade;
drop table if exists public.class cascade;
drop table if exists public.course cascade;
drop table if exists public.achievement cascade;
drop table if exists public.activity cascade;
drop table if exists public.user_profile cascade;

-- User Profile table
create table public.user_profile (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  first_name text not null,
  last_name text not null,
  role text not null check (role in ('student', 'teacher')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Course table
create table public.course (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Class table
create table public.class (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.course not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student-Class relationship table
create table public.student_class (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.user_profile not null,
  class_id uuid references public.class not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, class_id)
);

-- Activity table
create table public.activity (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  type text not null check (type in ('quiz', 'game', 'challenge')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  max_points integer not null,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activity Attempt table
create table public.activity_attempt (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profile not null,
  activity_id uuid references public.activity not null,
  points_earned integer not null,
  status text not null check (status in ('completed', 'in_progress', 'failed')),
  answers jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Progress table
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profile not null,
  current_level integer not null default 1,
  total_points integer not null default 0,
  daily_streak integer not null default 0,
  last_activity timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Achievement table
create table public.achievement (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  icon text,
  condition jsonb not null,
  reward_points integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Achievement table
create table public.user_achievement (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profile not null,
  achievement_id uuid references public.achievement not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Gamification Level table
create table public.gamification_level (
  id uuid default gen_random_uuid() primary key,
  level integer not null,
  name text not null,
  required_points integer not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(level)
);

-- Create indexes for better query performance
create index if not exists idx_user_profile_user_id on public.user_profile(user_id);
create index if not exists idx_student_class_student_id on public.student_class(student_id);
create index if not exists idx_student_class_class_id on public.student_class(class_id);
create index if not exists idx_activity_attempt_user_id on public.activity_attempt(user_id);
create index if not exists idx_activity_attempt_activity_id on public.activity_attempt(activity_id);
create index if not exists idx_user_achievement_user_id on public.user_achievement(user_id);
create index if not exists idx_user_achievement_achievement_id on public.user_achievement(achievement_id);

-- Enable Row Level Security (RLS)
alter table public.user_profile enable row level security;
alter table public.course enable row level security;
alter table public.class enable row level security;
alter table public.student_class enable row level security;
alter table public.activity enable row level security;
alter table public.activity_attempt enable row level security;
alter table public.user_progress enable row level security;
alter table public.achievement enable row level security;
alter table public.user_achievement enable row level security;
alter table public.gamification_level enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.user_profile for select
  using (true);

create policy "Users can insert their own profile"
  on public.user_profile for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.user_profile for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger handle_updated_at
  before update on public.user_profile
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.activity
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.activity_attempt
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.user_progress
  for each row
  execute procedure public.handle_updated_at();