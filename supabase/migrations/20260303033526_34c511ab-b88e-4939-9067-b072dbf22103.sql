
-- Fix all RLS policies: convert from RESTRICTIVE to PERMISSIVE

-- PROFILES
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert" ON public.profiles AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON public.profiles AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- MEDIA_LIBRARY
DROP POLICY IF EXISTS "media_select" ON public.media_library;
DROP POLICY IF EXISTS "media_insert" ON public.media_library;
DROP POLICY IF EXISTS "media_update" ON public.media_library;
DROP POLICY IF EXISTS "media_delete" ON public.media_library;

CREATE POLICY "media_select" ON public.media_library AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "media_insert" ON public.media_library AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "media_update" ON public.media_library AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "media_delete" ON public.media_library AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- USER_HISTORY
DROP POLICY IF EXISTS "history_select" ON public.user_history;
DROP POLICY IF EXISTS "history_insert" ON public.user_history;
DROP POLICY IF EXISTS "history_delete" ON public.user_history;

CREATE POLICY "history_select" ON public.user_history AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "history_insert" ON public.user_history AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "history_delete" ON public.user_history AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);
