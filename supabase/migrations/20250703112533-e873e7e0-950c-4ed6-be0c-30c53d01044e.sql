
-- Create a table for team compositions
CREATE TABLE public.team_compositions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  formation TEXT NOT NULL,
  player_positions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.team_compositions ENABLE ROW LEVEL SECURITY;

-- Create policy for public viewing
CREATE POLICY "Public can view team compositions" 
  ON public.team_compositions 
  FOR SELECT 
  USING (true);

-- Create policy for authenticated users to manage compositions
CREATE POLICY "Authenticated users can manage compositions" 
  ON public.team_compositions 
  FOR ALL 
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.team_compositions 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
