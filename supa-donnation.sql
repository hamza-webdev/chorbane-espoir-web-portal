
-- Modifier la table donations pour améliorer la structure
ALTER TABLE public.donations 
ALTER COLUMN donor_name DROP NOT NULL;

-- Ajouter une contrainte pour s'assurer qu'on a soit un nom soit c'est anonyme
ALTER TABLE public.donations 
ADD CONSTRAINT check_donor_info 
CHECK (
  (is_anonymous = true AND donor_name IS NOT NULL) OR 
  (is_anonymous = false AND donor_name IS NOT NULL)
);

-- Modifier la colonne status pour avoir des valeurs plus claires
ALTER TABLE public.donations 
ALTER COLUMN status SET DEFAULT 'completed';

-- Ajouter un index sur le statut pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);

-- Ajouter un index sur is_anonymous pour les requêtes
CREATE INDEX IF NOT EXISTS idx_donations_anonymous ON public.donations(is_anonymous);

-- Ajouter un index sur created_at pour l'ordre chronologique
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);
