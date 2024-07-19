import supabase from "../supabase";
import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 10; // Limit fetching to 10 at a time

// Fetcher to fetch comments for a specific post 10 at a time
const fetchComments = async (key, postId) => {
  // Grab page index from given key
  const pageIndex = parseInt(key.split('=')[1], 10);

  // Fetch request to db for comments
  const { data: comments, error } = await supabase
    .from('Comments')
    .select('*, Profiles (username)') // Include usernames with the comments
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

  if (error) throw error;

  return comments;
};

// Hook for fetching comments based on a page and post
export const useSupabaseCommentsInfinite = (postId) => {
  const getKey = (pageIndex) => `comments=${pageIndex}&postId=${postId}`;

  const { data, mutate, size, setSize, error } = useSWRInfinite(
    (index) => getKey(index),
    (key) => fetchComments(key, postId),
    {
      revalidateOnFocus: false, // No revalidate when page is focused
      revalidateOnReconnect: false, // No revalidate when connection reestablished
      refreshInterval: 360000, // Revalidate automatically every hour
      dedupingInterval: 60000, // No revalidate within same minute
    }
  );

  // Function to add comment to db
  const addComment = async (userId, username, postId, content) => {
    const newComment = { 
      user_id: userId, 
      post_id: postId, 
      content: content, 
    };

    // Add db columns to comment object for cache
    const tempCacheComment = {
      id: Date.now(), // Temporary ID for the new comment
      ...newComment,
      created_at: new Date().toISOString(), // Temp created_at
      Profiles: { username: username } // Temp profile username
    }

    // Optimistically update the local cache
    mutate((currentData) => {
      const updatedComments = currentData ? [...currentData] : [];
      if (updatedComments.length > 0) {
        // Prepend the new comment to the beginning of the first page
        updatedComments[0].unshift(tempCacheComment);
      } else {
        // If there are no comments, create the first page with the new comment
        updatedComments.push([tempCacheComment]);
      }
      return updatedComments;
    }, false);

    // Insert comment to db
    await supabase
      .from('Comments')
      .insert([ newComment ]);

    return newComment;
  };

  return {
    data,
    size,
    setSize,
    addComment,
    error,
    mutate,
  };
};