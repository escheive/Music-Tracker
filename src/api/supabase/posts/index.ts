import supabase from "@api/supabase/supabase";
import useSWRInfinite from 'swr/infinite'

import { fetcher } from './fetcher';
import { getKey } from './swrKey';
import { simplifySongData, simplifyTopItems } from "./utils";

const METADATA_DAILY_LIMIT = 1;
const GENERAL_DAILY_LIMIT = 20;


// Hook for fetching, updating posts
export const useSupabasePostsInfinite = (userId: string | null) => {

  // Check if userId is defined before making the API call
  if (!userId) {
    // Handle the case where userId is undefined (e.g., return empty data or show error)
    return { data: null, setSize: null, size: null, error: 'User ID is undefined', isValidating: false };
  }

  const { data, mutate, size, setSize, error, isValidating } = useSWRInfinite((index) => getKey(index, userId), (key) => fetcher(key, userId), {
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnection
    refreshInterval: 360000, // Revalidate automatically every hour
    dedupingInterval: 60000, // Limit updates from api 1/min
  });

  // Function to create new post
  const createPost = async (post: Record<string, any>, username: string) => {
    let { user_id, type, content, metadata } = post; // Destructure new post

    // Check if the user has already posted this type today
    const { data: existingPosts, error: existingPostsError } = await supabase
      .from('Posts')
      .select('*')
      .eq('user_id', user_id)
      .eq('type', type)
      .gte('created_at', new Date().toISOString().split('T')[0]) // Check from the start of today
      .lte('created_at', new Date().toISOString()); // Until now

    if (existingPostsError) {
      console.error('Error checking existing posts:', existingPostsError);
      return null;
    }

    const limit =
      type === 'recentlyPlayed' || type === 'topItems' 
      ? METADATA_DAILY_LIMIT 
      : GENERAL_DAILY_LIMIT

    if (existingPosts.length > limit) {
      console.warn('User has already posted this type today.');
      return { error: 'You can only post your top items or recently played songs once per day.' };
    }

    // Simplify any metadata user wants to post to reduce size
    let simplifiedMetadata;
    if (type === 'recentlyPlayed') {
      simplifiedMetadata = simplifySongData(metadata);
    } else if (type === 'topItems') {
      simplifiedMetadata = simplifyTopItems(metadata);
    }

    // Add db columns to post for cache update
    const tempCachePost = {
      id: Date.now(),
      user_id,
      type,
      content,
      metadata: simplifiedMetadata,
      created_at: new Date().toISOString(),
      username: username,
      user_liked: false,
      like_count: 0,
      comment_count: 0
    }

    // Optimistically update the local cache
    mutate((currentData) => {
      const updatedPosts = currentData ? currentData : [];
      // If posts, add at beginning so its at top of feed
      if (updatedPosts.length > 0) {
        updatedPosts[0].unshift(tempCachePost);
      } else {
        // If no posts, push
        updatedPosts.push([tempCachePost]);
      }
      return updatedPosts;
    }, false);
  
    // Insert post to db
    const { error } = await supabase
      .from('Posts')
      .insert([
        { 
          user_id,
          type,
          content,
          metadata: simplifiedMetadata,
        },
      ])
      .select()
  
    if (error) {
      console.error('Error inserting post:', error);
      return null;
    }
  
    return tempCachePost;
  }

  // Handle user liking post
  const likePost = async (userId: string, postId: string) => {
    // Insert like to db
    await supabase
      .from('Likes')
      .insert([{
        user_id: userId, 
        post_id: postId,
      }]);

    // Update the local cache
    mutate((currentData) => {
      // Create a new array with updated liked post
      const newData = currentData?.map((page) =>
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

  // Handle user unliking a post
  const unlikePost = async (userId: string, postId: string) => {
    // Remove like from db
    await supabase
      .from('Likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    // Update the local cache
    mutate((currentData) => {
      // Create a new array with post like data updated
      const newData = currentData?.map((page) =>
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
    isValidating,
    likePost,
    unlikePost,
    createPost
  };
};