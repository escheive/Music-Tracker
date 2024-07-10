import supabase from "./supabase";

export const updateSupabaseProfile = async (profileId, newTheme) => {
  const { data, error } = await supabase
    .from('Profiles')
    .update({ theme: newTheme })
    .eq('id', profileId)
    .select()

  console.log(data)

    return { data, error }
}
          