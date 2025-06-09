-- Eliminar tablas en inglés
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

-- Eliminar políticas existentes en inglés
drop policy if exists "Public profiles are viewable by everyone" on public.user_profile;
drop policy if exists "Users can insert their own profile" on public.user_profile;
drop policy if exists "Users can update own profile" on public.user_profile;
drop policy if exists "Allow authenticated users to view profiles" on public.user_profile;
drop policy if exists "Allow profile creation during registration" on public.user_profile;

-- Eliminar funciones trigger en inglés
drop function if exists public.handle_updated_at() cascade;