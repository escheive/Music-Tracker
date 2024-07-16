export const removeLike = async (userId, postId) => {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', userId)
    .eq('post_id', postId);

  if (error) {
    console.error('Error removing like:', error);
    return null;
  }

  return data;
};