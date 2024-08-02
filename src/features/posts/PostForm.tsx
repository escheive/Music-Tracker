import { 
  Box, 
  FormControl,
  FormLabel,
  Textarea,
  Button, 
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useRecentlyPlayedSongs, useUsersTopItems } from '@api/spotify/spotify';
import { useAuthContext } from '@context/AuthProvider';
import { useState } from 'react';
import { useSupabasePostsInfinite } from '@api/supabase/posts';
import { useSupabaseProfile } from '@api/supabase/profile';

interface Post {
  user_id: string | number;
  type: 'general' | 'recentlyPlayed' | 'topItems';
  content: string;
  metadata: any;
}


export const PostForm = () => {
  const { session } = useAuthContext();
  const { data: recentlyPlayedSongs } = useRecentlyPlayedSongs();
  const { data: topItems } = useUsersTopItems();
  const { data: profile } = useSupabaseProfile(session?.user.id);
  const [draftedPost, setDraftedPost] = useState<Post>({
    user_id: session?.user.id || '',
    type: 'general',
    content: '',
    metadata: null
  });

  const userId = session?.user.id;

  const { createPost } = useSupabasePostsInfinite(userId || null);

  // Track changes to the create post form
  const handlePostChange = (e: any) => {
    let name, value;
    if (typeof e === 'string') {
      // Radiogroup updates
      name = 'type';
      value = e;
    } else {
      // This is from form inputs like Textarea
      name = e.target.name;
      value = e.target.value;
    }

    setDraftedPost(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Submit user post to db, update cache, reset post form
  const handlePostSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const postWithMetadata = draftedPost;

    if (draftedPost.type == 'recentlyPlayed') {
      postWithMetadata.metadata = recentlyPlayedSongs;
    } else if (draftedPost.type == 'topItems') {
      postWithMetadata.metadata = topItems;
    }

    if (createPost) {
      // Update db and cache
      await createPost(
        draftedPost,
        profile?.username
      )

      // Reset text area after submission
      setDraftedPost({
        user_id: session?.user.id || '',
        type: 'general',
        content: '',
        metadata: null
      });
    } else {
      console.error('cannot create post, function error');
    }
  };

  return (
    <Box width='100%' maxW='600px' mx='auto' mt={4} p={4}>
      <FormControl id="post">
        <FormLabel>What's on your mind?</FormLabel>
        <Textarea
          name='content'
          value={draftedPost.content}
          onChange={handlePostChange}
          placeholder='Type your post here...'
          size='md'
          resize='vertical'
        />
      </FormControl>
      <FormLabel>Share what you're listening to!</FormLabel>
      <RadioGroup 
        name='type' 
        value={draftedPost.type}
        onChange={handlePostChange}
      >
        <Stack spacing={5} direction='row'>
          <Radio colorScheme='green' name='type' value='general'>
            No thanks
          </Radio>
          <Radio colorScheme='green' name='type' value='recentlyPlayed'>
            Recently Played Songs
          </Radio>
          <Radio colorScheme='green' value='topItems'>
            Top Tracks and Artists
          </Radio>
        </Stack>
      </RadioGroup>
      <Button
        mt={4}
        onClick={handlePostSubmit}
      >
        Post
      </Button>
    </Box>
  );
};