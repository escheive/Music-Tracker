import supabase from "./supabase";
import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 10;


const fetchComments = async (key, postId) => {
  const pageIndex = parseInt(key.split('=')[1], 10);
  const { data: comments, error } = await supabase
    .from('Comments')
    .select('*, Profiles (username)')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

  if (error) throw error;

  return comments;
};

export const useSupabaseCommentsInfinite = (postId) => {
  const getKey = (pageIndex) => `comments=${pageIndex}&postId=${postId}`;

  const { data, mutate, size, setSize, error } = useSWRInfinite(
    (index) => getKey(index),
    (key) => fetchComments(key, postId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 360000,
      dedupingInterval: 60000,
    }
  );

  const addComment = async (userId, username, postId, content) => {
    const newComment = { 
      user_id: userId, 
      post_id: postId, 
      content: content, 
    };

    const tempCacheComment = {
      id: Date.now(), // Temporary ID for the new comment
      ...newComment,
      created_at: new Date().toISOString(), 
      Profiles: { username: username }
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