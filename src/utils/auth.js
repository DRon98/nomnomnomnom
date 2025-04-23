import supabase from './supabaseClient';

export const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  // Log the token for debugging
  console.log('Auth Token:', session.access_token);
  return session.access_token;
};

export const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};