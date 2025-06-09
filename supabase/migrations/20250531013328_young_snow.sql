/*
  # Update user profile RLS policies

  1. Changes
    - Add INSERT policy to allow authenticated users to create their own profile
    - Add UPDATE policy to allow users to update their own profile
    - Add SELECT policy to allow users to view their own profile

  2. Security
    - Ensures users can only create/update their own profile
    - Maintains data privacy while allowing necessary operations
*/

-- Enable RLS if not already enabled
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profile;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profile;

-- Create new policies
CREATE POLICY "Users can insert their own profile"
ON user_profile
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON user_profile
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own profile"
ON user_profile
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);