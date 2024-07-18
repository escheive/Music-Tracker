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

  const fetchCommentsForPost = async (postId) => {
    const { data: comments, error } = await supabase
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


    const addComment = async (userId, username, postId, content) => {
      await supabase
        .from('Comments')
        .insert([{
          user_id: userId, 
          username: username,
          post_id: postId,
          content: content,
        }]);

      mutate((currentData) => {
        const newData = currentData.map((page) =>
          page.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comment_count: post.comment_count + 1,
                  comments: [...post.comments, { user_id: userId, username: username, post_id: postId, content: content }],
                }
              : post
          )
        );

        return newData;
      }, false);
    };

    const getCommentsForPost = async (postId) => {
      const comments = await fetchCommentsForPost(postId);
      return comments;
    };
  
    return {
      data,
      size,
      setSize,
      error,
      likePost,
      unlikePost,
      addComment,
      getCommentsForPost,
    };
  };

// export const useSupabasePostsInfinite = (userId: any) => {
//   const fetcher = async (key: any) => {
//     const pageIndex = parseInt(key.split('=')[2], 10);
//     const { data, error } = await supabase
//       .from('posts_with_likes')
//       .select(`
//         *
//       `)
//       .order('created_at', { ascending: false })
//       .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);
    
//     if (error) {
//       console.error(error.message)
//       throw error.message;
//     }
    
//     return data;
//   };

//   const getKey = (pageIndex: number, previousPageData: any) => {
//     // If we reach the end, return null to stop fetching
//     if (previousPageData && !previousPageData.length) return null;

//     return `posts?is_published=true&page=${pageIndex}`; // SWR key, pageIndex
//   };

//   const { data, mutate, size, setSize, error } = useSWRInfinite(getKey, fetcher, {
//     revalidateOnFocus: false, // Disable revalidation on focus
//     revalidateOnReconnect: false, // Disable revalidation on reconnection
//     refreshInterval: 360000, // Revalidate automatically every hour
//     dedupingInterval: 60000
//   });

//   return {
//     data,
//     size,
//     setSize,
//     error,
//     likePost: async (userId, postId) => {
//       await supabase
//         .from('Likes')
//         .insert([{
//           id: userId, 
//           post_id: postId
//         }]);
      
//       // Update the local cache
//       mutate((currentData) => {
//         // Create a new array with updated posts data
//         const newData = currentData.map((page) =>
//           page.map((post) =>
//             post.id === postId
//               ? {
//                   ...post,
//                   like_count: post.like_count + 1,
//                   user_liked: true,
//                 }
//               : post
//           )
//         );

//         return newData;
//       }, false);
//     },
//   }
// };