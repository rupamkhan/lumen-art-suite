
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

DROP POLICY IF EXISTS "media_select" ON public.media_library;
DROP POLICY IF EXISTS "media_insert" ON public.media_library;
DROP POLICY IF EXISTS "media_update" ON public.media_library;
DROP POLICY IF EXISTS "media_delete" ON public.media_library;

DROP POLICY IF EXISTS "history_select" ON public.user_history;
DROP POLICY IF EXISTS "history_insert" ON public.user_history;
DROP POLICY IF EXISTS "history_delete" ON public.user_history;

-- Recreate as PERMISSIVE
CREATE POLICY "profiles_select" ON public.profiles AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert" ON public.profiles AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON public.profiles AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "media_select" ON public.media_library AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "media_insert" ON public.media_library AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "media_update" ON public.media_library AS PERMISSIVE FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "media_delete" ON public.media_library AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "history_select" ON public.user_history AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "history_insert" ON public.user_history AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "history_delete" ON public.user_history AS PERMISSIVE FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Ensure the trigger for auto-profile creation exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
