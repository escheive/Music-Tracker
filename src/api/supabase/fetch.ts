import supabase from "./supabase";
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

export const useSupabasePostsInfinite = () => {
  const fetcher = async (key: any) => {
    console.log(key)
    const pageIndex = parseInt(key.split('=')[2], 10);
    console.log(`Fetching page ${pageIndex}`);
    const { data, error } = await supabase
      .from('Posts')
      .select(`
        *,
        user: Profiles (username)
      `)
      .order('created_at', { ascending: false })
      .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);
   
    if (error) throw error.message;
    console.log(data)
    return data;
  };

  const getKey = (pageIndex: number, previousPageData: any) => {
    // If we reach the end, return null to stop fetching
    if (previousPageData && !previousPageData.length) return null;

    return `posts?is_published=true&page=${pageIndex}`; // SWR key, pageIndex
  };

  const { data, size, setSize, error } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnection
    refreshInterval: 360000, // Revalidate automatically every hour
    dedupingInterval: 60000
  });

  return {
    data,
    size,
    setSize,
    error
  };
};