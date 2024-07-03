import { useEffect, useState } from "react";
import supabase from "./supabase";
import useSWR from "swr";

export const supabaseFetcher = (url: string) => fetch(url, {method: 'GET'}).then(res => res.json());


export const useSupabaseProfile = (userId) => {
  const { data, mutate, error } = useSWR('api/supabase/profile', async () => {
    const { data, error } = await supabase
      .from('Profiles')
      .select()
      .eq('id', userId)
      .single();

    if (error) throw error.message;

    return data
  });

  return {
    data,
    mutate,
    error
  }
}

export const useSupabasePosts = () => {
  const { data, mutate, error } = useSWR("posts?is_published=true", async () => {
    const { data, error } = await supabase
      .from('Posts')
      .select("*")
   
    if (error) throw error.message;
    return data;
  });

  return {
    data,
    mutate,
    error
  }
}


// export const supabaseUserApi = async (req, res, userId) => {
//   console.log(userId)
//   if (req.method === 'GET') {

//     const { data, error } = await supabase
//       .from('Profiles')
//       .select()
//       .eq('id', userId)
//       .single();

//     if (error) {
//       return res.status(500).json({message: error})
//     }

//     return res.status(200).json({data})
//   }
// }


// export const useSupabaseUser = (userId: string | undefined) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState<unknown>(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('Profiles')
//           .select()
//           .eq('id', userId)
//           .single(); // Assuming userId is unique and fetching a single record

//         if (error) {
//           throw error;
//         }

//         setData(data);
//       } catch (error) {
//         setError(error);
//       }
//     };

//     if (userId) {
//       fetchUser();
//     }
//   }, [userId]);

//   return { data, error };
// };