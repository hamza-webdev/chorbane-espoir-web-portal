
-- Create a table for donations
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  donor_phone TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'DT',
  payment_method TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to the donations table
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view donations (for public display)
CREATE POLICY "Everyone can view donations" 
  ON public.donations 
  FOR SELECT 
  TO public;

-- Create policy that allows authenticated users to insert donations
CREATE POLICY "Anyone can create donations" 
  ON public.donations 
  FOR INSERT 
  TO public
  WITH CHECK (true);
