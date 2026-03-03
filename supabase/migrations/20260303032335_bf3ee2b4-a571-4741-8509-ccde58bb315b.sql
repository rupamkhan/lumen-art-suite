
-- Fix RLS: Drop all restrictive policies and recreate as permissive

-- profiles
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- media_library
DROP POLICY IF EXISTS "media_select" ON public.media_library;
DROP POLICY IF EXISTS "media_insert" ON public.media_library;
DROP POLICY IF EXISTS "media_update" ON public.media_library;
DROP POLICY IF EXISTS "media_delete" ON public.media_library;

CREATE POLICY "media_select" ON public.media_library FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "media_insert" ON public.media_library FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "media_update" ON public.media_library FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "media_delete" ON public.media_library FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- user_history
DROP POLICY IF EXISTS "history_select" ON public.user_history;
DROP POLICY IF EXISTS "history_insert" ON public.user_history;
DROP POLICY IF EXISTS "history_delete" ON public.user_history;

CREATE POLICY "history_select" ON public.user_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "history_insert" ON public.user_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "history_delete" ON public.user_history FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Also ensure the handle_new_user trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
