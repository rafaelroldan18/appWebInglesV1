-- Enable RLS if not already enabled
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow profile creation during registration" ON user_profile;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profile;
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profile;
END $$;

-- Policy for profile creation during registration
CREATE POLICY "Allow profile creation during registration"
  ON user_profile
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profile
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profile
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);