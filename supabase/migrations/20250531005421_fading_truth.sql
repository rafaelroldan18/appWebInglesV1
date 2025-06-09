-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Drop existing tables if they exist (in reverse order of dependencies)
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

-- Course table
create table public.course (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references public.user_profile not null,
  name text not null,
  description text,
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  status text not null check (status in ('draft', 'published', 'archived')) default 'draft',
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Module table (new)
create table public.module (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.course not null,
  name text not null,
  description text,
  order_index integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Class table
create table public.class (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.course not null,
  name text not null,
  schedule jsonb,
  max_students integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Course Enrollment table (new)
create table public.course_enrollment (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.user_profile not null,
  course_id uuid references public.course not null,
  status text not null check (status in ('active', 'completed', 'dropped')) default 'active',
  enrollment_date timestamp with time zone default timezone('utc'::text, now()) not null,
  completion_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, course_id)
);

-- Student-Class relationship table
create table public.student_class (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.user_profile not null,
  class_id uuid references public.class not null,
  status text not null check (status in ('active', 'inactive')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, class_id)
);

-- Activity table
create table public.activity (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references public.module not null,
  title text not null,
  description text,
  type text not null check (type in ('quiz', 'game', 'challenge', 'assignment')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  max_points integer not null,
  duration_minutes integer,
  content jsonb not null,
  prerequisites jsonb,
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
  status text not null check (status in ('completed', 'in_progress', 'failed')),
  time_spent_seconds integer,
  answers jsonb,
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Module Completion table (new)
create table public.module_completion (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references public.user_profile not null,
  module_id uuid references public.module not null,
  status text not null check (status in ('not_started', 'in_progress', 'completed')) default 'not_started',
  progress_percentage integer not null default 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(student_id, module_id)
);

-- User Progress table
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profile not null,
  current_level integer not null default 1,
  total_points integer not null default 0,
  daily_streak integer not null default 0,
  weekly_points integer not null default 0,
  monthly_points integer not null default 0,
  last_activity timestamp with time zone,
  statistics jsonb default '{}',
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
  category text not null check (category in ('progress', 'skill', 'social', 'special')),
  condition jsonb not null,
  reward_points integer not null default 0,
  badge_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Achievement table
create table public.user_achievement (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profile not null,
  achievement_id uuid references public.achievement not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  progress jsonb default '{}',
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
  benefits jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(level)
);

-- Create indexes for better query performance
create index if not exists idx_user_profile_user_id on public.user_profile(user_id);
create index if not exists idx_course_teacher_id on public.course(teacher_id);
create index if not exists idx_module_course_id on public.module(course_id);
create index if not exists idx_module_order_index on public.module(order_index);
create index if not exists idx_activity_module_id on public.activity(module_id);
create index if not exists idx_activity_order_index on public.activity(order_index);
create index if not exists idx_course_enrollment_student_id on public.course_enrollment(student_id);
create index if not exists idx_course_enrollment_course_id on public.course_enrollment(course_id);
create index if not exists idx_student_class_student_id on public.student_class(student_id);
create index if not exists idx_student_class_class_id on public.student_class(class_id);
create index if not exists idx_activity_attempt_user_id on public.activity_attempt(user_id);
create index if not exists idx_activity_attempt_activity_id on public.activity_attempt(activity_id);
create index if not exists idx_module_completion_student_id on public.module_completion(student_id);
create index if not exists idx_module_completion_module_id on public.module_completion(module_id);
create index if not exists idx_user_achievement_user_id on public.user_achievement(user_id);
create index if not exists idx_user_achievement_achievement_id on public.user_achievement(achievement_id);

-- Enable Row Level Security (RLS)
alter table public.user_profile enable row level security;
alter table public.course enable row level security;
alter table public.module enable row level security;
alter table public.class enable row level security;
alter table public.course_enrollment enable row level security;
alter table public.student_class enable row level security;
alter table public.activity enable row level security;
alter table public.activity_attempt enable row level security;
alter table public.module_completion enable row level security;
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

-- Create trigger function for updated_at
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
  before update on public.course
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.module
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
  before update on public.module_completion
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.user_progress
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.course_enrollment
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.student_class
  for each row
  execute procedure public.handle_updated_at();