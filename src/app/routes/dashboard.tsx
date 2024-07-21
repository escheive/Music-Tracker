import { Box, Heading } from '@chakra-ui/react';
import { PostList } from '@features/posts/PostList';
import { PostForm } from '@features/posts/PostForm';


export const DashboardRoute = () => {

  return (
    <Box display='flex' flexDirection='column' alignItems='center' marginBlock='5%' >
      <Heading>Music Tracker for Spotify</Heading>

      <PostForm />

      <PostList />

    </Box>
  );
};