import supabase from '@api/supabase/supabase';

const PAGE_SIZE = 10; // Limit 10 posts at a time

// Function to handle post fetching
export const fetcher = async (key: string, userId: string) => {
  const pageIndex = parseInt(key.split('=')[2], 10);
  
  // Fetch posts with like counts and comment counts
  const { data: posts, error: postsError } = await supabase
    .from('posts_with_likes_and_comments')
    .select('*')
    .order('created_at', { ascending: false })
    .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

  if (postsError) throw postsError;

  const postIds = posts.map(post => post.id); // Grab all ids from fetched posts
  // Fetch this users likes for post ids
  const { data: likes, error: likesError } = await supabase
    .from('Likes')
    .select('*')
    .in('post_id', postIds)
    .eq('user_id', userId);

  if (likesError) throw likesError;

  // Add if this user liked a post to post data
  const postsWithLikes = posts.map(post => ({
    ...post,
    user_liked: likes.some(like => like.post_id === post.id),
  }));

  return postsWithLikes;
};