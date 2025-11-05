/*
  # Sistema Completo de Gamificación para Aprendizaje de Inglés

  1. Tablas Base
    - `perfil_usuario` - Perfiles de estudiantes y profesores
    - `unidad_aprendizaje` - Unidades del libro (13-16)
    - `tema` - Temas dentro de cada unidad
    - `actividad` - Actividades interactivas
    - `intento_actividad` - Intentos de los estudiantes
    - `progreso_estudiante` - Progreso general del estudiante
    - `logro` - Logros disponibles
    - `logro_usuario` - Logros obtenidos por estudiantes
    - `nivel_gamificado` - Sistema de niveles
    - `mision` - Misiones y retos
    - `progreso_mision` - Progreso en misiones

  2. Seguridad
    - RLS habilitado en todas las tablas
    - Políticas para estudiantes y profesores
    - Validación de permisos por rol

  3. Notas
    - Sistema basado en retos/misiones + puntos/recompensas
    - Actividades: Quiz, Match Up, Complete Sentence, Flashcards
    - Contenido alineado con unidades 13-16 del libro
*/

create extension if not exists "pgcrypto";

drop table if exists public.progreso_mision cascade;
drop table if exists public.mision cascade;
drop table if exists public.logro_usuario cascade;
drop table if exists public.nivel_gamificado cascade;
drop table if exists public.progreso_estudiante cascade;
drop table if exists public.intento_actividad cascade;
drop table if exists public.actividad cascade;
drop table if exists public.tema cascade;
drop table if exists public.unidad_aprendizaje cascade;
drop table if exists public.perfil_usuario cascade;
drop table if exists public.logro cascade;

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

create table public.unidad_aprendizaje (
  id uuid default gen_random_uuid() primary key,
  numero integer not null,
  nombre text not null,
  descripcion text,
  nivel text not null check (nivel in ('a1', 'a2', 'b1')),
  orden integer not null,
  estado text not null check (estado in ('borrador', 'publicado', 'archivado')) default 'publicado',
  pagina_inicio integer,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.tema (
  id uuid default gen_random_uuid() primary key,
  id_unidad uuid references public.unidad_aprendizaje not null,
  nombre text not null,
  descripcion text,
  gramatica text[],
  vocabulario text[],
  comunicacion text[],
  orden integer not null,
  duracion_estimada integer,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.actividad (
  id uuid default gen_random_uuid() primary key,
  id_tema uuid references public.tema not null,
  titulo text not null,
  descripcion text,
  tipo text not null check (tipo in ('vocabulario', 'gramatica', 'lectura', 'escucha', 'habla', 'escritura', 'mixto')),
  formato text not null check (formato in ('quiz', 'match_up', 'flashcards', 'complete_sentence', 'group_sort', 'anagram', 'speaking_cards')),
  dificultad text not null check (dificultad in ('facil', 'medio', 'dificil')),
  puntos_maximos integer not null,
  duracion_minutos integer,
  contenido jsonb not null,
  orden integer not null,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.intento_actividad (
  id uuid default gen_random_uuid() primary key,
  id_usuario uuid references public.perfil_usuario not null,
  id_actividad uuid references public.actividad not null,
  puntos_obtenidos integer not null,
  porcentaje_precision integer,
  tiempo_segundos integer,
  respuestas jsonb,
  errores_cometidos jsonb,
  estado text not null check (estado in ('completado', 'en_progreso', 'fallido')),
  retroalimentacion text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.progreso_estudiante (
  id uuid default gen_random_uuid() primary key,
  id_estudiante uuid references public.perfil_usuario not null,
  nivel_actual integer not null default 1,
  experiencia_total integer not null default 0,
  monedas integer not null default 0,
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

create table public.logro (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  categoria text not null check (categoria in ('habilidad', 'progreso', 'racha', 'especial', 'mision')),
  tipo_habilidad text check (tipo_habilidad in ('vocabulario', 'gramatica', 'lectura', 'escucha', 'habla', 'escritura')),
  condicion jsonb not null,
  recompensa_exp integer not null default 0,
  recompensa_monedas integer not null default 0,
  url_insignia text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.logro_usuario (
  id uuid default gen_random_uuid() primary key,
  id_estudiante uuid references public.perfil_usuario not null,
  id_logro uuid references public.logro not null,
  fecha_obtencion timestamp with time zone default timezone('utc'::text, now()) not null,
  progreso jsonb default '{}',
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(id_estudiante, id_logro)
);

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

create table public.mision (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  descripcion text,
  tipo text not null check (tipo in ('diaria', 'semanal', 'especial', 'unidad')),
  categoria text not null check (categoria in ('vocabulario', 'gramatica', 'lectura', 'escucha', 'habla', 'escritura', 'mixto')),
  id_unidad uuid references public.unidad_aprendizaje,
  objetivos jsonb not null default '[]',
  recompensa_exp integer not null default 0,
  recompensa_monedas integer not null default 0,
  orden integer not null default 0,
  estado text not null check (estado in ('activo', 'inactivo', 'archivado')) default 'activo',
  fecha_inicio timestamp with time zone,
  fecha_fin timestamp with time zone,
  icono text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.progreso_mision (
  id uuid default gen_random_uuid() primary key,
  id_estudiante uuid references public.perfil_usuario not null,
  id_mision uuid references public.mision not null,
  estado text not null check (estado in ('en_progreso', 'completada', 'fallida', 'abandonada')) default 'en_progreso',
  progreso_actual jsonb default '{}',
  fecha_inicio timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_completado timestamp with time zone,
  intentos integer default 1,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  fecha_actualizacion timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(id_estudiante, id_mision)
);

create index idx_perfil_usuario_id_usuario on public.perfil_usuario(id_usuario);
create index idx_perfil_usuario_rol on public.perfil_usuario(rol);
create index idx_tema_id_unidad on public.tema(id_unidad);
create index idx_actividad_id_tema on public.actividad(id_tema);
create index idx_actividad_formato on public.actividad(formato);
create index idx_intento_actividad_id_usuario on public.intento_actividad(id_usuario);
create index idx_intento_actividad_id_actividad on public.intento_actividad(id_actividad);
create index idx_intento_actividad_estado on public.intento_actividad(estado);
create index idx_logro_usuario_id_estudiante on public.logro_usuario(id_estudiante);
create index idx_logro_usuario_id_logro on public.logro_usuario(id_logro);
create index idx_mision_tipo on public.mision(tipo);
create index idx_mision_categoria on public.mision(categoria);
create index idx_mision_id_unidad on public.mision(id_unidad);
create index idx_mision_estado on public.mision(estado);
create index idx_progreso_mision_id_estudiante on public.progreso_mision(id_estudiante);
create index idx_progreso_mision_id_mision on public.progreso_mision(id_mision);
create index idx_progreso_mision_estado on public.progreso_mision(estado);

alter table public.perfil_usuario enable row level security;
alter table public.unidad_aprendizaje enable row level security;
alter table public.tema enable row level security;
alter table public.actividad enable row level security;
alter table public.intento_actividad enable row level security;
alter table public.progreso_estudiante enable row level security;
alter table public.logro enable row level security;
alter table public.logro_usuario enable row level security;
alter table public.nivel_gamificado enable row level security;
alter table public.mision enable row level security;
alter table public.progreso_mision enable row level security;

create policy "Perfiles visibles para todos autenticados"
  on public.perfil_usuario for select
  to authenticated
  using (true);

create policy "Usuarios pueden crear su propio perfil"
  on public.perfil_usuario for insert
  to authenticated
  with check (auth.uid() = id_usuario);

create policy "Usuarios pueden actualizar su propio perfil"
  on public.perfil_usuario for update
  to authenticated
  using (auth.uid() = id_usuario)
  with check (auth.uid() = id_usuario);

create policy "Unidades publicadas visibles para estudiantes"
  on public.unidad_aprendizaje for select
  to authenticated
  using (estado = 'publicado' or exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Profesores pueden gestionar unidades"
  on public.unidad_aprendizaje for all
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Temas visibles para estudiantes"
  on public.tema for select
  to authenticated
  using (true);

create policy "Profesores pueden gestionar temas"
  on public.tema for all
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Actividades visibles para estudiantes"
  on public.actividad for select
  to authenticated
  using (true);

create policy "Profesores pueden gestionar actividades"
  on public.actividad for all
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Estudiantes pueden crear sus intentos"
  on public.intento_actividad for insert
  to authenticated
  with check (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_usuario
    and perfil_usuario.id_usuario = auth.uid()
  ));

create policy "Estudiantes pueden ver sus intentos"
  on public.intento_actividad for select
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_usuario
    and perfil_usuario.id_usuario = auth.uid()
  ) or exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Estudiantes pueden actualizar sus intentos"
  on public.intento_actividad for update
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_usuario
    and perfil_usuario.id_usuario = auth.uid()
  ));

create policy "Estudiantes pueden ver su progreso"
  on public.progreso_estudiante for select
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_estudiante
    and perfil_usuario.id_usuario = auth.uid()
  ) or exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Sistema puede crear progreso inicial"
  on public.progreso_estudiante for insert
  to authenticated
  with check (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_estudiante
    and perfil_usuario.id_usuario = auth.uid()
  ));

create policy "Estudiantes pueden actualizar su progreso"
  on public.progreso_estudiante for update
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_estudiante
    and perfil_usuario.id_usuario = auth.uid()
  ));

create policy "Logros visibles para todos"
  on public.logro for select
  to authenticated
  using (true);

create policy "Profesores pueden gestionar logros"
  on public.logro for all
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Estudiantes pueden ver sus logros"
  on public.logro_usuario for select
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_estudiante
    and perfil_usuario.id_usuario = auth.uid()
  ) or exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Sistema puede registrar logros"
  on public.logro_usuario for insert
  to authenticated
  with check (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_estudiante
    and perfil_usuario.id_usuario = auth.uid()
  ));

create policy "Niveles visibles para todos"
  on public.nivel_gamificado for select
  to authenticated
  using (true);

create policy "Profesores pueden gestionar niveles"
  on public.nivel_gamificado for all
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Misiones activas visibles para estudiantes"
  on public.mision for select
  to authenticated
  using (estado = 'activo' or exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Profesores pueden gestionar misiones"
  on public.mision for all
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Estudiantes pueden ver su progreso en misiones"
  on public.progreso_mision for select
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_estudiante
    and perfil_usuario.id_usuario = auth.uid()
  ) or exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id_usuario = auth.uid()
    and perfil_usuario.rol = 'profesor'
  ));

create policy "Estudiantes pueden iniciar misiones"
  on public.progreso_mision for insert
  to authenticated
  with check (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_estudiante
    and perfil_usuario.id_usuario = auth.uid()
  ));

create policy "Estudiantes pueden actualizar su progreso en misiones"
  on public.progreso_mision for update
  to authenticated
  using (exists (
    select 1 from public.perfil_usuario
    where perfil_usuario.id = id_estudiante
    and perfil_usuario.id_usuario = auth.uid()
  ));

create or replace function public.manejar_fecha_actualizacion()
returns trigger as $$
begin
  new.fecha_actualizacion = now();
  return new;
end;
$$ language plpgsql;

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

create trigger manejar_fecha_actualizacion before update on public.mision
  for each row execute procedure public.manejar_fecha_actualizacion();

create trigger manejar_fecha_actualizacion before update on public.progreso_mision
  for each row execute procedure public.manejar_fecha_actualizacion();
