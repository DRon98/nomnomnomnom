import supabase from './supabaseClient';

export const getAuthToken = async () => {
  // Get the active session
  const session = await supabase.auth.getSession();
  return session?.data?.session?.access_token || null;
};

export const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};