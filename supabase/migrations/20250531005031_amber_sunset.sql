-- Drop tables if they exist (checking existence first)
do $$ 
begin
    -- Drop Spanish-named tables if they exist
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'logro_usuario') then
        drop table public.logro_usuario cascade;
    end if;
    
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'nivel_gamificado') then
        drop table public.nivel_gamificado cascade;
    end if;
    
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'progreso_usuario') then
        drop table public.progreso_usuario cascade;
    end if;
    
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'intento_actividad') then
        drop table public.intento_actividad cascade;
    end if;
    
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'estudiante_paralelo') then
        drop table public.estudiante_paralelo cascade;
    end if;
    
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'paralelo') then
        drop table public.paralelo cascade;
    end if;
    
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'curso') then
        drop table public.curso cascade;
    end if;
    
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'logro') then
        drop table public.logro cascade;
    end if;
    
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'actividad') then
        drop table public.actividad cascade;
    end if;
    
    if exists (select from pg_tables where schemaname = 'public' and tablename = 'perfil_usuario') then
        -- Drop policies first if they exist
        drop policy if exists "Public profiles are viewable by everyone" on public.perfil_usuario;
        drop policy if exists "Users can insert their own profile" on public.perfil_usuario;
        drop policy if exists "Users can update own profile" on public.perfil_usuario;
        
        -- Then drop the table
        drop table public.perfil_usuario cascade;
    end if;
end $$;