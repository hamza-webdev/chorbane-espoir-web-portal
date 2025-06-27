-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.
CREATE TYPE competition_type AS ENUM ('league', 'cup', 'tournament');
CREATE TYPE match_status AS ENUM ('a_venir', 'en_cours', 'termine', 'annule');
CREATE TYPE player_position AS ENUM ('gardien', 'défenseur', 'milieu', 'attaquant');
CREATE TYPE staff_role AS ENUM ('entraineur', 'assistant', 'medecin', 'preparateur_physique');



CREATE TABLE public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  published boolean DEFAULT false,
  author text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT articles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.competitions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type competition_type NOT NULL,
  season text,
  description text,
  start_date date,
  end_date date,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT competitions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.donations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  donor_name text,
  donor_email text,
  donor_phone text,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'DT'::text,
  payment_method text NOT NULL,
  is_anonymous boolean NOT NULL DEFAULT false,
  message text,
  status text NOT NULL DEFAULT 'completed'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT donations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.galleries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_image text,
  event_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT galleries_pkey PRIMARY KEY (id)
);
CREATE TABLE public.matches (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  competition_id uuid,
  opponent_team text NOT NULL,
  match_date timestamp with time zone NOT NULL,
  venue text,
  is_home boolean DEFAULT true,
  our_score integer,
  opponent_score integer,
  status match_status DEFAULT 'a_venir'::match_status,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT matches_pkey PRIMARY KEY (id),
  CONSTRAINT matches_competition_id_fkey FOREIGN KEY (competition_id) REFERENCES public.competitions(id)
);
CREATE TABLE public.photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  gallery_id uuid,
  image_url text NOT NULL,
  caption text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT photos_pkey PRIMARY KEY (id),
  CONSTRAINT photos_gallery_id_fkey FOREIGN KEY (gallery_id) REFERENCES public.galleries(id)
);
CREATE TABLE public.players (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  jersey_number integer,
  position player_position NOT NULL,
  age integer,
  height integer,
  weight integer,
  photo text,
  bio text,
  joined_date date,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT players_pkey PRIMARY KEY (id)
);
CREATE TABLE public.staff (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role staff_role NOT NULL,
  photo text,
  bio text,
  phone text,
  email text,
  joined_date date,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT staff_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_ip text NOT NULL,
  entity_type text NOT NULL CHECK (entity_type = ANY (ARRAY['article'::text, 'player'::text, 'staff'::text, 'match'::text])),
  entity_id uuid NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type = ANY (ARRAY['like'::text, 'dislike'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + '24:00:00'::interval),
  CONSTRAINT user_reactions_pkey PRIMARY KEY (id)
);