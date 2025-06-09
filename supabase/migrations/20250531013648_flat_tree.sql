-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profile;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profile;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profile;

-- Enable RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

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

-- Add email column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'user_profile' 
                  AND column_name = 'email') THEN
        ALTER TABLE user_profile ADD COLUMN email text NOT NULL;
    END IF;
END $$;