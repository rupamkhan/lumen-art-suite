
-- Drop all duplicate/conflicting RLS policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Drop duplicate policies on media_library
DROP POLICY IF EXISTS "Users can view own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can view their own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can insert own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can insert their own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can update their own media" ON public.media_library;
DROP POLICY IF EXISTS "Users can delete their own media" ON public.media_library;

-- Drop policies on user_history
DROP POLICY IF EXISTS "Users can view their own history" ON public.user_history;
DROP POLICY IF EXISTS "Users can insert their own history" ON public.user_history;
DROP POLICY IF EXISTS "Users can delete their own history" ON public.user_history;

-- Recreate PERMISSIVE policies for profiles (use user_id consistently)
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Recreate PERMISSIVE policies for media_library
CREATE POLICY "media_select" ON public.media_library FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "media_insert" ON public.media_library FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "media_update" ON public.media_library FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "media_delete" ON public.media_library FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Recreate PERMISSIVE policies for user_history
CREATE POLICY "history_select" ON public.user_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "history_insert" ON public.user_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "history_delete" ON public.user_history FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create trigger for new user profile creation (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
