-- Enable Row Level Security
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow ALL operations (for development/testing)
-- In production, you should restrict this based on user authentication
CREATE POLICY "Allow all operations on recommendations" ON recommendations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Alternative: More restrictive policies for production
-- Uncomment these and comment the "Allow all" policy above for production use

-- Policy for SELECT (anyone can read)
-- CREATE POLICY "Anyone can read recommendations" ON recommendations
--   FOR SELECT
--   USING (true);

-- Policy for INSERT (authenticated users only)
-- CREATE POLICY "Authenticated users can insert recommendations" ON recommendations
--   FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');

-- Policy for UPDATE (authenticated users only)
-- CREATE POLICY "Authenticated users can update recommendations" ON recommendations
--   FOR UPDATE
--   USING (auth.role() = 'authenticated')
--   WITH CHECK (auth.role() = 'authenticated');

-- Policy for DELETE (authenticated users only)
-- CREATE POLICY "Authenticated users can delete recommendations" ON recommendations
--   FOR DELETE
--   USING (auth.role() = 'authenticated');
