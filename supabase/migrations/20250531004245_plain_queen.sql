-- Drop existing policies
drop policy if exists "Public profiles are viewable by everyone" on perfil_usuario;
drop policy if exists "Users can insert their own profile" on perfil_usuario;
drop policy if exists "Users can update own profile" on perfil_usuario;

-- Create new policies with proper permissions
create policy "Public profiles are viewable by everyone"
on perfil_usuario for select
using (true);

create policy "Users can insert their own profile"
on perfil_usuario for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own profile"
on perfil_usuario for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Enable RLS
alter table perfil_usuario enable row level security;