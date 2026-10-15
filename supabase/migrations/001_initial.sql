-- ============================================================
-- SoloDev Blog - Supabase PostgreSQL Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ── 0. Enable necessary extensions ───────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ── 1. PROFILES table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'reader'
                CHECK (role IN ('reader', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Everyone can read profiles (for comment author display)
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own non-role fields
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));


-- ── Trigger: auto-create profile on new user sign-up ─────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', ''),
    'reader'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ── 2. POSTS table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  summary     TEXT NOT NULL,
  content     TEXT NOT NULL,
  published   BOOLEAN NOT NULL DEFAULT true,
  author_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts
CREATE POLICY "posts_select_published"
  ON public.posts FOR SELECT
  USING (published = true);

-- Only admins can insert
CREATE POLICY "posts_insert_admin"
  ON public.posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update
CREATE POLICY "posts_update_admin"
  ON public.posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete
CREATE POLICY "posts_delete_admin"
  ON public.posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ── 3. COMMENTS table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Everyone can read comments
CREATE POLICY "comments_select_all"
  ON public.comments FOR SELECT
  USING (true);

-- Authenticated users can insert their own comments
CREATE POLICY "comments_insert_authenticated"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Comment owners OR admins can delete
CREATE POLICY "comments_delete_own_or_admin"
  ON public.comments FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ── 4. LIKES table ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.likes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Everyone can read likes (for counts)
CREATE POLICY "likes_select_all"
  ON public.likes FOR SELECT
  USING (true);

-- Authenticated users can insert their own like
CREATE POLICY "likes_insert_own"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Users can delete their own like
CREATE POLICY "likes_delete_own"
  ON public.likes FOR DELETE
  USING (auth.uid() = user_id);


-- ── 5. Indexes for performance ────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_slug       ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published  ON public.posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post    ON public.comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_likes_post       ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user       ON public.likes(user_id);


-- ── 6. Seed: Promote a user to admin ─────────────────────────
-- After signing up with your email, run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';


-- ── 7. Seed: Sample post ──────────────────────────────────────
-- Replace <your-admin-uuid> with your actual user UUID from auth.users
-- INSERT INTO public.posts (title, slug, summary, content, published, author_id) VALUES (
--   'Hello World — My First Post',
--   'hello-world',
--   'Welcome to my blog built with Astro, Tailwind, and Supabase.',
--   E'# Hello World\n\nThis is my first post. Built with **Astro SSR**, **Tailwind CSS**, and **Supabase**.\n\n## What I Built\n\nA full-stack blog with:\n- Magic link authentication\n- Row-Level Security\n- Real-time likes and comments\n\n```ts\nconsole.log("Hello, SoloDev!");\n```\n\nStay tuned for more content!',
--   true,
--   '<your-admin-uuid>'
-- );
