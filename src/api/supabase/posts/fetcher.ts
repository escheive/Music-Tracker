import supabase from '@api/supabase/supabase';

const PAGE_SIZE = 10;

export const fetcher = async (key, userId) => {
  const pageIndex = parseInt(key.split('=')[2], 10);
  
  // Fetch posts with like counts
  const { data: posts, error: postsError } = await supabase
    .from('posts_with_likes_and_comments')
    .select('*')
    .order('created_at', { ascending: false })
    .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

  if (postsError) throw postsError;

  // Fetch user likes for these posts
  const postIds = posts.map(post => post.id);
  const { data: likes, error: likesError } = await supabase
    .from('Likes')
    .select('*')
    .in('post_id', postIds)
    .eq('user_id', userId);

  if (likesError) throw likesError;

  // Merge the results
  const postsWithLikes = posts.map(post => ({
    ...post,
    user_liked: likes.some(like => like.post_id === post.id),
  }));

  return postsWithLikes;
};