
-- Créer une table pour stocker les likes/dislikes
CREATE TABLE public.user_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_ip TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('article', 'player', 'staff', 'match')),
  entity_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '1 hours'),
  
  -- Contrainte unique pour empêcher plusieurs réactions du même utilisateur sur la même entité
  UNIQUE(user_ip, entity_type, entity_id)
);

-- Créer un index pour améliorer les performances des requêtes
CREATE INDEX idx_user_reactions_entity ON public.user_reactions(entity_type, entity_id);
CREATE INDEX idx_user_reactions_expires ON public.user_reactions(expires_at);

-- Créer une vue pour compter les likes et dislikes
CREATE OR REPLACE VIEW public.reaction_counts AS
SELECT 
  entity_type,
  entity_id,
  COUNT(CASE WHEN reaction_type = 'like' THEN 1 END) as likes_count,
  COUNT(CASE WHEN reaction_type = 'dislike' THEN 1 END) as dislikes_count
FROM public.user_reactions 
WHERE expires_at > now()
GROUP BY entity_type, entity_id;

-- Fonction pour nettoyer les réactions expirées
CREATE OR REPLACE FUNCTION public.cleanup_expired_reactions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.user_reactions WHERE expires_at <= now();
END;
$$;

-- Activer RLS sur la table
ALTER TABLE public.user_reactions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de lire les réactions
CREATE POLICY "Anyone can view reactions" 
  ON public.user_reactions 
  FOR SELECT 
  USING (true);

-- Politique pour permettre à tous d'insérer des réactions
CREATE POLICY "Anyone can insert reactions" 
  ON public.user_reactions 
  FOR INSERT 
  WITH CHECK (true);

-- Politique pour permettre à tous de mettre à jour leurs propres réactions
CREATE POLICY "Anyone can update their own reactions" 
  ON public.user_reactions 
  FOR UPDATE 
  USING (true);
