-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Drop existing tables
drop table if exists public.module_completion cascade;
drop table if exists public.module cascade;
drop table if exists public.course_enrollment cascade;
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
  email text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Learning Unit table (replaces Course)
create table public.learning_unit (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  level text not null check (level in ('a1', 'a2', 'b1')),
  order_index integer not null,
  status text not null check (status in ('draft', 'published', 'archived')) default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Topic table (replaces Module)
create table public.topic (
  id uuid default gen_random_uuid() primary key,
  unit_id uuid references public.learning_unit not null,
  name text not null,
  description text,
  grammar_focus text[],
  vocabulary_focus text[],
  order_index integer not null,
  estimated_duration_minutes integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activity table
create table public.activity (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references public.topic not null,
  title text not null,
  description text,
  type text not null check (type in ('vocabulary', 'grammar', 'reading', 'listening', 'speaking', 'writing')),
  format text not null check (format in ('quiz', 'game', 'exercise', 'challenge')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  max_points integer not null,
  duration_minutes integer,
  content jsonb not null,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activity Attempt table
create table public.activity_attempt (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profile not null,
  activity_id uuid references public.activity not null,
  points_earned integer not null,
  accuracy_percentage integer,
  time_spent_seconds integer,
  mistakes_made jsonb,
  status text not null check (status in ('completed', 'in_progress', 'failed')),
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Topic Progress table
create table public.topic_progress (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.user_profile not null,
  topic_id uuid references public.topic not null,
  status text not null check (status in ('not_started', 'in_progress', 'completed')) default 'not_started',
  progress_percentage integer not null default 0,
  mastery_level text check (mastery_level in ('none', 'basic', 'intermediate', 'advanced')),
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, topic_id)
);

-- Student Progress table
create table public.student_progress (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.user_profile not null,
  current_level integer not null default 1,
  total_xp integer not null default 0,
  vocabulary_mastered integer not null default 0,
  grammar_points integer not null default 0,
  daily_streak integer not null default 0,
  weekly_xp integer not null default 0,
  monthly_xp integer not null default 0,
  last_activity timestamp with time zone,
  skill_levels jsonb default '{"vocabulary": 0, "grammar": 0, "reading": 0, "listening": 0, "speaking": 0, "writing": 0}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id)
);

-- Achievement table
create table public.achievement (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text not null check (category in ('skill', 'progress', 'streak', 'special')),
  skill_type text check (skill_type in ('vocabulary', 'grammar', 'reading', 'listening', 'speaking', 'writing')),
  condition jsonb not null,
  xp_reward integer not null default 0,
  badge_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student Achievement table
create table public.student_achievement (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.user_profile not null,
  achievement_id uuid references public.achievement not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  progress jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, achievement_id)
);

-- Level System table
create table public.level_system (
  id uuid default gen_random_uuid() primary key,
  level integer not null,
  name text not null,
  xp_required integer not null,
  icon text,
  rewards jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(level)
);

-- Create indexes
create index idx_user_profile_user_id on public.user_profile(user_id);
create index idx_topic_unit_id on public.topic(unit_id);
create index idx_activity_topic_id on public.activity(topic_id);
create index idx_activity_attempt_user_id on public.activity_attempt(user_id);
create index idx_activity_attempt_activity_id on public.activity_attempt(activity_id);
create index idx_topic_progress_student_id on public.topic_progress(student_id);
create index idx_topic_progress_topic_id on public.topic_progress(topic_id);
create index idx_student_achievement_student_id on public.student_achievement(student_id);
create index idx_student_achievement_achievement_id on public.student_achievement(achievement_id);

-- Enable RLS
alter table public.user_profile enable row level security;
alter table public.learning_unit enable row level security;
alter table public.topic enable row level security;
alter table public.activity enable row level security;
alter table public.activity_attempt enable row level security;
alter table public.topic_progress enable row level security;
alter table public.student_progress enable row level security;
alter table public.achievement enable row level security;
alter table public.student_achievement enable row level security;
alter table public.level_system enable row level security;

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

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers
create trigger handle_updated_at before update on public.user_profile
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.learning_unit
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.topic
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.activity
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.activity_attempt
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.topic_progress
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.student_progress
  for each row execute procedure public.handle_updated_at();