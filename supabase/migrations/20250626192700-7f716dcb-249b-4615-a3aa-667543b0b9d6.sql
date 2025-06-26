
-- Remove existing problematic policies if they exist
DROP POLICY IF EXISTS "Policy with table joins" ON public.players;

-- Create proper RLS policies for authenticated users to manage all data
-- Articles policies
CREATE POLICY "Enable all operations for authenticated users" ON public.articles
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Players policies  
CREATE POLICY "Enable all operations for authenticated users" ON public.players
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Staff policies
CREATE POLICY "Enable all operations for authenticated users" ON public.staff
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Matches policies
CREATE POLICY "Enable all operations for authenticated users" ON public.matches
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Competitions policies
CREATE POLICY "Enable all operations for authenticated users" ON public.competitions
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Galleries policies
CREATE POLICY "Enable all operations for authenticated users" ON public.galleries
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Photos policies
CREATE POLICY "Enable all operations for authenticated users" ON public.photos
FOR ALL TO authenticated USING (true) WITH CHECK (true);
