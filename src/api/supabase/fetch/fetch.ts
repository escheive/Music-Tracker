import supabase from "../supabase";
import useSWR from "swr";
import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 10;

export const supabaseFetcher = (url: string) => fetch(url, {method: 'GET'}).then(res => res.json());


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

  return {
    data,
    isLoading,
    error,
    // Function to manually update the profile in the cache
    updateProfile: async (newProfile) => {
      await supabase
        .from('Profiles')
        .update(newProfile)
        .eq('id', userId);
      
      // Update the local cache with the new profile data
      mutate({ ...data, ...newProfile }, false);
    },
  }
}

export const useSupabasePosts = () => {
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('Posts')
      .select(`
        *,
        user: Profiles (username)
      `)
   
    if (error) throw error.message;
    return data;
  }

  const { data, mutate, error } = useSWR("posts?is_published=true", fetchPosts, {
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnection
    refreshInterval: 360000, // Revalidate automatically every hour
    dedupingInterval: 60000
  });

  return {
    data,
    mutate,
    error
  }
}

const getKey = (pageIndex: number, previousPageData: any) => {
  // If we reach the end, return null to stop fetching
  if (previousPageData && !previousPageData.length) return null;

  return `posts?is_published=true&page=${pageIndex}`; // SWR key, pageIndex
};

const fetcher = async (key, userId) => {
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

const fetchComments = async (key, postId) => {
  const pageIndex = parseInt(key.split('=')[1], 10);
  const { data: comments, error } = await supabase
    .from('Comments')
    .select('*, Profiles (username)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
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
        updatedComments[updatedComments.length - 1].push(tempCacheComment);
      } else {
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


const fetchCommentsForPost = async (postId) => {
  const { data: comments, mutate, error } = await supabase
    .from('Comments')
    .select('*, Profiles (username)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return comments;
};

export const useSupabasePostsInfinite = (userId) => {
  const { data, mutate, size, setSize, error } = useSWRInfinite((index) => getKey(index, userId), (key) => fetcher(key, userId), {
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnection
    refreshInterval: 360000, // Revalidate automatically every hour
    dedupingInterval: 60000,
  });

  const likePost = async (userId, postId) => {
    await supabase
      .from('Likes')
      .insert([{
        user_id: userId, 
        post_id: postId,
      }]);

    // Update the local cache
    mutate((currentData) => {
      // Create a new array with updated posts data
      const newData = currentData.map((page) =>
        page.map((post) =>
          post.id === postId
            ? {
                ...post,
                like_count: post.like_count + 1,
                user_liked: true,
              }
            : post
        )
      );

      return newData;
    }, false);
  };

  const unlikePost = async (userId, postId) => {
    await supabase
      .from('Likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    // Update the local cache
    mutate((currentData) => {
      // Create a new array with updated posts data
      const newData = currentData.map((page) =>
        page.map((post) =>
          post.id === postId
            ? {
                ...post,
                like_count: post.like_count - 1,
                user_liked: false,
              }
            : post
        )
      );

      return newData;
    }, false);
  };

  return {
    data,
    size,
    setSize,
    error,
    likePost,
    unlikePost,
  };
};