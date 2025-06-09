-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profile;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profile;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profile;

-- Enable RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Create new policies with broader insert permissions
CREATE POLICY "Allow profile creation during registration"
ON user_profile
FOR INSERT
TO authenticated
WITH CHECK (true);

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