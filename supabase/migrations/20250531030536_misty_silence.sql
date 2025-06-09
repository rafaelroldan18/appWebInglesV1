-- Drop existing policies
DROP POLICY IF EXISTS "Allow profile creation during registration" ON user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profile;

-- Enable RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Create new policies with broader permissions
CREATE POLICY "Allow authenticated users to view profiles"
ON user_profile FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow profile creation during registration"
ON user_profile FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update own profile"
ON user_profile FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);