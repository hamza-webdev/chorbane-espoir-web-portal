
-- =====================================================
-- CRÉATION COMPLÈTE DE LA BASE DE DONNÉES CHORBANE
-- =====================================================

-- Supprimer les tables existantes si elles existent (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS public.photos CASCADE;
DROP TABLE IF EXISTS public.galleries CASCADE;
DROP TABLE IF EXISTS public.user_reactions CASCADE;
DROP TABLE IF EXISTS public.donations CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.competitions CASCADE;
DROP TABLE IF EXISTS public.staff CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.articles CASCADE;

-- Supprimer les types ENUM s'ils existent
DROP TYPE IF EXISTS competition_type CASCADE;
DROP TYPE IF EXISTS match_status CASCADE;
DROP TYPE IF EXISTS player_position CASCADE;
DROP TYPE IF EXISTS staff_role CASCADE;

-- Supprimer les vues
DROP VIEW IF EXISTS public.reaction_counts CASCADE;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS public.cleanup_expired_reactions() CASCADE;

-- =====================================================
-- CRÉATION DES TYPES ENUM
-- =====================================================

CREATE TYPE competition_type AS ENUM ('league', 'cup', 'tournament');
CREATE TYPE match_status AS ENUM ('a_venir', 'en_cours', 'termine', 'annule');
CREATE TYPE player_position AS ENUM ('gardien', 'défenseur', 'milieu', 'attaquant');
CREATE TYPE staff_role AS ENUM ('entraineur', 'assistant', 'medecin', 'preparateur_physique');

-- =====================================================
-- CRÉATION DES TABLES
-- =====================================================

-- Table des articles
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des joueurs
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  jersey_number INTEGER,
  position player_position NOT NULL,
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  photo TEXT,
  bio TEXT,
  joined_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table du staff
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role staff_role NOT NULL,
  photo TEXT,
  bio TEXT,
  phone TEXT,
  email TEXT,
  joined_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des compétitions
CREATE TABLE public.competitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type competition_type NOT NULL,
  season TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des matchs
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES public.competitions(id),
  opponent_team TEXT NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT,
  is_home BOOLEAN DEFAULT true,
  our_score INTEGER,
  opponent_score INTEGER,
  status match_status DEFAULT 'a_venir',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des donations
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'DT',
  payment_method TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des galeries
CREATE TABLE public.galleries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  event_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des photos
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES public.galleries(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table des réactions utilisateurs
CREATE TABLE public.user_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_ip TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('article', 'player', 'staff', 'match')),
  entity_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  UNIQUE(user_ip, entity_type, entity_id)
);

-- =====================================================
-- CRÉATION DES INDEX
-- =====================================================

-- Index pour les donations
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_anonymous ON public.donations(is_anonymous);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);

-- Index pour les réactions
CREATE INDEX idx_user_reactions_entity ON public.user_reactions(entity_type, entity_id);
CREATE INDEX idx_user_reactions_expires ON public.user_reactions(expires_at);

-- =====================================================
-- CRÉATION DES VUES
-- =====================================================

-- Vue pour compter les réactions
CREATE OR REPLACE VIEW public.reaction_counts AS
SELECT 
  entity_type,
  entity_id,
  COUNT(CASE WHEN reaction_type = 'like' THEN 1 END) as likes_count,
  COUNT(CASE WHEN reaction_type = 'dislike' THEN 1 END) as dislikes_count
FROM public.user_reactions 
WHERE expires_at > now()
GROUP BY entity_type, entity_id;

-- =====================================================
-- CRÉATION DES FONCTIONS
-- =====================================================

-- Fonction pour nettoyer les réactions expirées
CREATE OR REPLACE FUNCTION public.cleanup_expired_reactions()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.user_reactions WHERE expires_at <= now();
END;
$$;

-- =====================================================
-- ACTIVATION DE RLS SUR TOUTES LES TABLES
-- =====================================================

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reactions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLITIQUES RLS - LECTURES PUBLIQUES
-- =====================================================

-- Articles - lecture publique
CREATE POLICY "Everyone can view published articles" 
  ON public.articles 
  FOR SELECT 
  USING (published = true);

-- Joueurs - lecture publique
CREATE POLICY "Everyone can view active players" 
  ON public.players 
  FOR SELECT 
  USING (active = true);

-- Staff - lecture publique
CREATE POLICY "Everyone can view active staff" 
  ON public.staff 
  FOR SELECT 
  USING (active = true);

-- Compétitions - lecture publique
CREATE POLICY "Everyone can view active competitions" 
  ON public.competitions 
  FOR SELECT 
  USING (active = true);

-- Matchs - lecture publique
CREATE POLICY "Everyone can view matches" 
  ON public.matches 
  FOR SELECT 
  USING (true);

-- Donations - lecture publique
CREATE POLICY "Everyone can view donations" 
  ON public.donations 
  FOR SELECT 
  USING (true);

-- Galeries - lecture publique
CREATE POLICY "Everyone can view galleries" 
  ON public.galleries 
  FOR SELECT 
  USING (true);

-- Photos - lecture publique
CREATE POLICY "Everyone can view photos" 
  ON public.photos 
  FOR SELECT 
  USING (true);

-- Réactions - lecture publique
CREATE POLICY "Everyone can view reactions" 
  ON public.user_reactions 
  FOR SELECT 
  USING (true);

-- =====================================================
-- POLITIQUES RLS - GESTION COMPLÈTE POUR ADMIN
-- =====================================================

-- Articles - gestion complète pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage articles" 
  ON public.articles 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Joueurs - gestion complète pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage players" 
  ON public.players 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Staff - gestion complète pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage staff" 
  ON public.staff 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Compétitions - gestion complète pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage competitions" 
  ON public.competitions 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Matchs - gestion complète pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage matches" 
  ON public.matches 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Donations - gestion complète pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage donations" 
  ON public.donations 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Galeries - gestion complète pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage galleries" 
  ON public.galleries 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Photos - gestion complète pour les utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage photos" 
  ON public.photos 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- =====================================================
-- POLITIQUES RLS - CRÉATION PUBLIQUE POUR DONATIONS ET RÉACTIONS
-- =====================================================

-- Donations - création publique (pour les dons anonymes)
CREATE POLICY "Anyone can create donations" 
  ON public.donations 
  FOR INSERT 
  WITH CHECK (true);

-- Réactions - gestion publique
CREATE POLICY "Anyone can insert reactions" 
  ON public.user_reactions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update reactions" 
  ON public.user_reactions 
  FOR UPDATE 
  USING (true);

-- =====================================================
-- CONTRAINTES SUPPLÉMENTAIRES
-- =====================================================

-- Contrainte pour les donations
ALTER TABLE public.donations 
ADD CONSTRAINT check_donor_info 
CHECK (
  (is_anonymous = true) OR 
  (is_anonymous = false AND donor_name IS NOT NULL)
);

-- =====================================================
-- COMMENTAIRES SUR LES TABLES
-- =====================================================

COMMENT ON TABLE public.articles IS 'Table des articles de presse et actualités';
COMMENT ON TABLE public.players IS 'Table des joueurs de l''équipe';
COMMENT ON TABLE public.staff IS 'Table du personnel (entraîneurs, médecins, etc.)';
COMMENT ON TABLE public.competitions IS 'Table des compétitions et championnats';
COMMENT ON TABLE public.matches IS 'Table des matchs';
COMMENT ON TABLE public.donations IS 'Table des donations et contributions';
COMMENT ON TABLE public.galleries IS 'Table des galeries photos';
COMMENT ON TABLE public.photos IS 'Table des photos dans les galeries';
COMMENT ON TABLE public.user_reactions IS 'Table des réactions (likes/dislikes) des utilisateurs';
