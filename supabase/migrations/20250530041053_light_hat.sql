/*
  # Fix RLS policies for perfil_usuario table

  1. Security Changes
    - Add INSERT policy for authenticated users to create their own profile
    - Ensure users can only create profiles with their own user_id
*/

-- Drop existing INSERT policy if it exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can insert their own profile" ON perfil_usuario;
END $$;

-- Create new INSERT policy with proper checks
CREATE POLICY "Users can insert their own profile"
ON perfil_usuario
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);