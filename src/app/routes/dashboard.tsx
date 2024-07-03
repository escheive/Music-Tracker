import { useNavigate } from 'react-router';
import { Box, Heading, Button, Text } from '@chakra-ui/react';

import { beginLogin } from '@/api/spotify/auth';
import { useSpotifyUser } from '@api/spotify/spotify';
import { useAuthContext } from '@context/AuthProvider';
import { useSupabasePosts } from '@api/supabase/fetch';


export const DashboardRoute = () => {
  const navigate = useNavigate();
  const { user } = useSpotifyUser();
  const { session } = useAuthContext();
  const { data: posts, mutate: postsMutate, error: errorMutate } = useSupabasePosts();

  console.log(posts)

  return (
    <Box display='flex' flexDirection='column' alignItems='center' marginBlock='5%' >
      <Heading>Music Tracker for Spotify</Heading>
      <Box flexDirection='column' width='60%'>
        {posts?.map((post) => {

          return (
            <Box key={post.id}>
              <Text>{post.content}</Text>
            </Box>
          )
        })}
      </Box>
    </Box>
  );
};