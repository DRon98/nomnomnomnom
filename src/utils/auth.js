import supabase from './supabaseClient';

export const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  return session.access_token;
};

export const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};