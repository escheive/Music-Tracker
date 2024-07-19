import supabase from "../supabase";
import useSWR from "swr";

export const useSupabaseProfile = (userId: any) => {
  const { data, mutate, isLoading, error } = useSWR(userId ? 'api/supabase/profile' : null, async () => {
    const { data, error } = await supabase
      .from('Profiles')
      .select()
      .eq('id', userId)
      .single();

    if (error) throw error.message;

    return data
  }, {
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnection
    refreshInterval: 0, // Disable revalidation
    dedupingInterval: 60000
  });

  // Function to manually update the profile in the cache
  const updateProfile = async (newProfile) => {
    await supabase
      .from('Profiles')
      .update(newProfile)
      .eq('id', userId);
    
    // Update the local cache with the new profile data
    mutate({ ...data, ...newProfile }, false);
  };

  const createProfile = async (userId, profile) => {
    const { data, error } = await supabase
      .from('Profiles')
      .insert([
        { 
          id: userId,
          username: profile.username,
          theme: profile.theme
        }
      ]);
  
    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }
    return data;
  }

  return {
    data,
    isLoading,
    error,
    updateProfile,
    createProfile
  }
}

