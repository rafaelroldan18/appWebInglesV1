-- Habilitar generación de UUID
create extension if not exists "pgcrypto";

-- Eliminar tablas existentes si existen
drop table if exists public.logro_usuario cascade;
drop table if exists public.nivel_gamificado cascade;
drop table if exists public.progreso_estudiante cascade;
drop table if exists public.intento_actividad cascade;
drop table if exists public.actividad cascade;
drop table if exists public.tema cascade;
drop table if exists public.unidad_aprendizaje cascade;
drop table if exists public.perfil_usuario cascade;

-- Tabla Perfil de Usuario
create table public.perfil_usuario (
  id uuid default gen_random_uuid() primary key,
  id_usuario uuid references auth.users not null,
  nombre text not null,
  apellido text not null,
  rol text not null check (rol in ('estudiante', 'profesor')),
  correo text not null,
  url_avatar text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla Unidad de Aprendizaje
create table public.unidad_aprendizaje (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  nivel text not null check (nivel in ('a1', 'a2', 'b1')),
  orden integer not null,
  estado text not null check (estado in ('borrador', 'publicado', 'archivado')) default 'borrador',
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla Tema
create table public.tema (
  id uuid default gen_random_uuid() primary key,
  id_unidad uuid references public.unidad_aprendizaje not null,
  nombre text not null,
  descripcion text,
  gramatica text[],
  vocabulario text[],
  orden integer not null,
  duracion_estimada integer,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla Actividad
create table public.actividad (
  id uuid default gen_random_uuid() primary key,
  id_tema uuid references public.tema not null,
  titulo text not null,
  descripcion text,
  tipo text not null check (tipo in ('vocabulario', 'gramatica', 'lectura', 'escucha', 'habla', 'escritura')),
  formato text not null check (formato in ('quiz', 'juego', 'ejercicio', 'desafio')),
  dificultad text not null check (dificultad in ('facil', 'medio', 'dificil')),
  puntos_maximos integer not null,
  duracion_minutos integer,
  contenido jsonb not null,
  orden integer not null,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla Intento de Actividad
create table public.intento_actividad (
  id uuid default gen_random_uuid() primary key,
  id_usuario uuid references public.perfil_usuario not null,
  id_actividad uuid references public.actividad not null,
  puntos_obtenidos integer not null,
  porcentaje_precision integer,
  tiempo_segundos integer,
  errores_cometidos jsonb,
  estado text not null check (estado in ('completado', 'en_progreso', 'fallido')),
  retroalimentacion text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla Progreso del Estudiante
create table public.progreso_estudiante (
  id uuid default gen_random_uuid() primary key,
  id_estudiante uuid references public.perfil_usuario not null,
  nivel_actual integer not null default 1,
  experiencia_total integer not null default 0,
  vocabulario_dominado integer not null default 0,
  puntos_gramatica integer not null default 0,
  racha_diaria integer not null default 0,
  experiencia_semanal integer not null default 0,
  experiencia_mensual integer not null default 0,
  ultima_actividad timestamp with time zone,
  niveles_habilidad jsonb default '{"vocabulario": 0, "gramatica": 0, "lectura": 0, "escucha": 0, "habla": 0, "escritura": 0}',
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(id_estudiante)
);

-- Tabla Logro
create table public.logro (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  categoria text not null check (categoria in ('habilidad', 'progreso', 'racha', 'especial')),
  tipo_habilidad text check (tipo_habilidad in ('vocabulario', 'gramatica', 'lectura', 'escucha', 'habla', 'escritura')),
  condicion jsonb not null,
  recompensa_exp integer not null default 0,
  url_insignia text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabla Logro del Usuario
create table public.logro_usuario (
  id uuid default gen_random_uuid() primary key,
  id_estudiante uuid references public.perfil_usuario not null,
  id_logro uuid references public.logro not null,
  fecha_obtencion timestamp with time zone default timezone('utc'::text, now()) not null,
  progreso jsonb default '{}',
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(id_estudiante, id_logro)
);

-- Tabla Sistema de Niveles
create table public.nivel_gamificado (
  id uuid default gen_random_uuid() primary key,
  nivel integer not null,
  nombre text not null,
  exp_requerida integer not null,
  icono text,
  recompensas jsonb,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(nivel)
);

-- Crear índices
create index idx_perfil_usuario_id_usuario on public.perfil_usuario(id_usuario);
create index idx_tema_id_unidad on public.tema(id_unidad);
create index idx_actividad_id_tema on public.actividad(id_tema);
create index idx_intento_actividad_id_usuario on public.intento_actividad(id_usuario);
create index idx_intento_actividad_id_actividad on public.intento_actividad(id_actividad);
create index idx_logro_usuario_id_estudiante on public.logro_usuario(id_estudiante);
create index idx_logro_usuario_id_logro on public.logro_usuario(id_logro);

-- Habilitar RLS
alter table public.perfil_usuario enable row level security;
alter table public.unidad_aprendizaje enable row level security;
alter table public.tema enable row level security;
alter table public.actividad enable row level security;
alter table public.intento_actividad enable row level security;
alter table public.progreso_estudiante enable row level security;
alter table public.logro enable row level security;
alter table public.logro_usuario enable row level security;
alter table public.nivel_gamificado enable row level security;

-- Crear políticas
create policy "Perfiles públicos visibles para todos"
  on public.perfil_usuario for select
  using (true);

create policy "Usuarios pueden crear su propio perfil"
  on public.perfil_usuario for insert
  to authenticated
  with check (auth.uid() = id_usuario);

create policy "Usuarios pueden actualizar su propio perfil"
  on public.perfil_usuario for update
  using (auth.uid() = id_usuario)
  with check (auth.uid() = id_usuario);

-- Crear función para manejar fecha_actualizacion
create or replace function public.manejar_fecha_actualizacion()
returns trigger as $$
begin
  new.fecha_actualizacion = now();
  return new;
end;
$$ language plpgsql;

-- Crear triggers
create trigger manejar_fecha_actualizacion before update on public.perfil_usuario
  for each row execute procedure public.manejar_fecha_actualizacion();

create trigger manejar_fecha_actualizacion before update on public.unidad_aprendizaje
  for each row execute procedure public.manejar_fecha_actualizacion();

create trigger manejar_fecha_actualizacion before update on public.tema
  for each row execute procedure public.manejar_fecha_actualizacion();

create trigger manejar_fecha_actualizacion before update on public.actividad
  for each row execute procedure public.manejar_fecha_actualizacion();

create trigger manejar_fecha_actualizacion before update on public.intento_actividad
  for each row execute procedure public.manejar_fecha_actualizacion();

create trigger manejar_fecha_actualizacion before update on public.progreso_estudiante
  for each row execute procedure public.manejar_fecha_actualizacion();