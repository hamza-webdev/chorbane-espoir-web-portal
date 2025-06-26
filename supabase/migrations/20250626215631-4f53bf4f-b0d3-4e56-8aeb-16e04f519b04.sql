
-- Supprimer l'ancienne politique qui nécessite l'authentification
DROP POLICY IF EXISTS "Anyone can create donations" ON public.donations;

-- Créer une nouvelle politique qui permet à tout le monde d'insérer des donations
CREATE POLICY "Anyone can create donations" 
  ON public.donations 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Assurer que la politique de lecture existe toujours
DROP POLICY IF EXISTS "Everyone can view donations" ON public.donations;
CREATE POLICY "Everyone can view donations" 
  ON public.donations 
  FOR SELECT 
  TO public;
