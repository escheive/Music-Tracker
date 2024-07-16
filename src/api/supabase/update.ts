import supabase from "./supabase";

export const updateSupabaseProfile = async (profileId, newTheme) => {
  const { data, error } = await supabase
    .from('Profiles')
    .update({ theme: newTheme })
    .eq('id', profileId)
    .select()

    if (error) {
      console.error('Error adding like:', error);
      return null;
    }

    return data;
}

          