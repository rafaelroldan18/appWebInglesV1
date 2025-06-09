/*
  # Fix user_profile RLS policies

  1. Changes
    - Drop existing RLS policies for user_profile table
    - Create new RLS policies with correct permissions:
      - Allow authenticated users to create their own profile
      - Allow authenticated users to read their own profile
      - Allow authenticated users to update their own profile

  2. Security
    - Enable RLS on user_profile table
    - Add policies for INSERT, SELECT, and UPDATE operations
    - Ensure users can only access their own data
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow profile creation during registration" ON user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profile;

-- Enable RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy
CREATE POLICY "Allow profile creation during registration"
ON user_profile
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create SELECT policy
CREATE POLICY "Users can view own profile"
ON user_profile
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create UPDATE policy
CREATE POLICY "Users can update own profile"
ON user_profile
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);