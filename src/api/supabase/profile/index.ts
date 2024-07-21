import supabase from "../supabase";
import useSWR from "swr";

// Hook for users profile
export const useSupabaseProfile = (userId: any) => {

  // UseSWR hook to cache results and only fetch when valid session
  const { data, mutate, isLoading, error } = useSWR(userId ? 'api/supabase/profile' : null, async () => {

    // Fetch profile from db
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
    refreshInterval: 0, // Disable auto revalidation for profiles
    dedupingInterval: 60000 // Profiles only can be refetched once per min
  });

  // Function to update profile
  const updateProfile = async (newProfile: Record<string, any>) => {
    // Update profile in db
    await supabase
      .from('Profiles')
      .update(newProfile)
      .eq('id', userId);
    
    // Update the local cache with the new profile data
    mutate({ ...data, ...newProfile }, false);
  };

  // Creates a new user profile based on auth id
  const createProfile = async (userId: string, profile: Record<string, any>) => {
    // Insert to db
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

