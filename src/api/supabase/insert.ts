import supabase from "./supabase"

export const createPost = async (post) => {
  const { user_id, type, content, metadata } = post;
  const { data, error } = await supabase
  .from('Posts')
  .insert([
    { 
      user_id,
      type,
      content,
      metadata,
    },
  ])
  .select()
}

          