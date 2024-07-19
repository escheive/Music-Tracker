import supabase from "../supabase";
import useSWR from "swr";
import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 10;

const simplifySongData = (songs: any[]) => {
  return songs.slice(0, 10).map((song) => ({
    id: song.id,
    name: song.name,
    artist: song.artists[0].name,
    imageUrl: song.album.images[0].url,
    spotifyUrl: song.external_urls.spotify,
  }));
};

const simplifyTopItems = (topItems: { artists: { items: [] }, tracks: { items: []}}) => {
  const simplifiedArtists = topItems.artists.items.slice(0, 5).map((artist: any) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images[0]?.url,
    spotifyUrl: artist.external_urls.spotify,
  }))
  const simplifiedTracks = topItems.tracks.items.slice(0, 5).map((track: any) => ({
    id: track.id,
    name: track.name,
    imageUrl: track.album.images[0]?.url,
    spotifyUrl: track.external_urls.spotify,
  }))

  return {
    artists: simplifiedArtists,
    tracks: simplifiedTracks
  };
};

export const useSupabasePostsInfinite = (userId) => {
  const { data, mutate, size, setSize, error } = useSWRInfinite((index) => getKey(index, userId), (key) => fetcher(key, userId), {
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnection
    refreshInterval: 360000, // Revalidate automatically every hour
    dedupingInterval: 60000,
  });

  const createPost = async (post: any, username: any) => {
    let { user_id, type, content, metadata } = post;

    let simplifiedMetadata;
    if (type === 'recentlyPlayed') {
      simplifiedMetadata = simplifySongData(metadata);
    } else if (type === 'topItems') {
      simplifiedMetadata = simplifyTopItems(metadata);
    }

    const tempCachePost = {
      id: Date.now(), // Temporary ID for the new post
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
      const updatedPosts = currentData ? [...currentData] : [];
      if (updatedPosts.length > 0) {
        updatedPosts[0].unshift(tempCachePost);
      } else {
        updatedPosts.push([tempCachePost]);
      }
      return updatedPosts;
    }, false);
  
    const { data, error } = await supabase
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
  
    return data[0];
  }

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
    createPost
  };
};