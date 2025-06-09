-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Drop existing tables if they exist (in reverse order of dependencies)
drop table if exists public.logro_usuario cascade;
drop table if exists public.nivel_gamificado cascade;
drop table if exists public.progreso_usuario cascade;
drop table if exists public.intento_actividad cascade;
drop table if exists public.estudiante_paralelo cascade;
drop table if exists public.paralelo cascade;
drop table if exists public.curso cascade;
drop table if exists public.logro cascade;
drop table if exists public.actividad cascade;
drop table if exists public.perfil_usuario cascade;

-- User Profile table
create table public.perfil_usuario (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  nombre text not null,
  apellido text not null,
  rol text not null check (rol in ('estudiante', 'profesor', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Course table
create table public.curso (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Parallel (Section) table
create table public.paralelo (
  id uuid default gen_random_uuid() primary key,
  curso_id uuid references public.curso not null,
  nombre text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Student-Parallel relationship table
create table public.estudiante_paralelo (
  id uuid default gen_random_uuid() primary key,
  estudiante_id uuid references public.perfil_usuario not null,
  paralelo_id uuid references public.paralelo not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(estudiante_id, paralelo_id)
);

-- Activity table
create table public.actividad (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descripcion text,
  tipo text not null check (tipo in ('quiz', 'juego', 'reto')),
  dificultad text not null check (dificultad in ('facil', 'medio', 'dificil')),
  puntos_max integer not null,
  contenido jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activity Attempt table
create table public.intento_actividad (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.perfil_usuario not null,
  actividad_id uuid references public.actividad not null,
  puntos_obtenidos integer not null,
  estado text not null check (estado in ('completado', 'en_progreso', 'fallido')),
  respuestas jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Progress table
create table public.progreso_usuario (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.perfil_usuario not null,
  nivel_actual integer not null default 1,
  puntos_totales integer not null default 0,
  racha_diaria integer not null default 0,
  ultima_actividad timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(usuario_id)
);

-- Achievement table
create table public.logro (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  icono text,
  condicion jsonb not null,
  puntos_recompensa integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Achievement table
create table public.logro_usuario (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references public.perfil_usuario not null,
  logro_id uuid references public.logro not null,
  fecha_obtencion timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(usuario_id, logro_id)
);

-- Gamification Level table
create table public.nivel_gamificado (
  id uuid default gen_random_uuid() primary key,
  nivel integer not null,
  nombre text not null,
  puntos_requeridos integer not null,
  icono text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(nivel)
);

-- Create indexes for better query performance
create index if not exists idx_perfil_usuario_user_id on public.perfil_usuario(user_id);
create index if not exists idx_estudiante_paralelo_estudiante_id on public.estudiante_paralelo(estudiante_id);
create index if not exists idx_estudiante_paralelo_paralelo_id on public.estudiante_paralelo(paralelo_id);
create index if not exists idx_intento_actividad_usuario_id on public.intento_actividad(usuario_id);
create index if not exists idx_intento_actividad_actividad_id on public.intento_actividad(actividad_id);
create index if not exists idx_logro_usuario_usuario_id on public.logro_usuario(usuario_id);
create index if not exists idx_logro_usuario_logro_id on public.logro_usuario(logro_id);

-- Enable Row Level Security (RLS)
alter table public.perfil_usuario enable row level security;
alter table public.curso enable row level security;
alter table public.paralelo enable row level security;
alter table public.estudiante_paralelo enable row level security;
alter table public.actividad enable row level security;
alter table public.intento_actividad enable row level security;
alter table public.progreso_usuario enable row level security;
alter table public.logro enable row level security;
alter table public.logro_usuario enable row level security;
alter table public.nivel_gamificado enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.perfil_usuario for select
  using (true);

create policy "Users can insert their own profile"
  on public.perfil_usuario for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.perfil_usuario for update
  using (auth.uid() = user_id);

-- Drop existing trigger function if it exists
drop function if exists public.handle_updated_at() cascade;

-- Create trigger function
create function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger handle_updated_at
  before update on public.perfil_usuario
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.actividad
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.intento_actividad
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.progreso_usuario
  for each row
  execute procedure public.handle_updated_at();