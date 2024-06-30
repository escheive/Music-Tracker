import { useEffect, useState } from "react";
import supabase from "./supabase"


export const useSupabaseUser = (userId: string | undefined) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('Profiles')
          .select()
          .eq('id', userId)
          .single(); // Assuming userId is unique and fetching a single record

        if (error) {
          throw error;
        }

        setData(data);
      } catch (error) {
        setError(error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { data, error };
};