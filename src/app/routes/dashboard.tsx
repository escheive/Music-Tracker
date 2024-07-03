import { useNavigate } from 'react-router';
import { 
  Box, 
  Heading, 
  Text, 
  FormControl,
  FormLabel,
  Textarea,
  Button, 
  Radio,
  RadioGroup,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  Flex,
  Image,
  Link,
} from '@chakra-ui/react';

import { beginLogin } from '@/api/spotify/auth';
import { useRecentlyPlayedSongs, useSpotifyUser, useUsersTopItems } from '@api/spotify/spotify';
import { useAuthContext } from '@context/AuthProvider';
import { useSupabasePosts } from '@api/supabase/fetch';
import { useState } from 'react';
import { createPost } from '@api/supabase/insert';


export const DashboardRoute = () => {
  const navigate = useNavigate();
  const { user } = useSpotifyUser();
  const { session } = useAuthContext();
  const { data: posts, mutate: postsMutate, error: errorMutate } = useSupabasePosts();
  const { data: recentlyPlayedSongs } = useRecentlyPlayedSongs();
  const { data: topItems } = useUsersTopItems();
  const [draftedPost, setDraftedPost] = useState({
    user_id: session?.user.id,
    type: 'general',
    content: '',
    metadata: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  console.log(posts)

  const handlePostChange = (e) => {
    const { name, value } = typeof e === 'object' ? e.target : { name: 'type', value: e};
    setDraftedPost(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePostSubmit = () => {
    let metadata: any;
    if (draftedPost.type == 'recentlyPlayed') {
      metadata = recentlyPlayedSongs;
    } else if (draftedPost.type == 'topItems') {
      metadata = topItems;
    }

    createPost({
      ...draftedPost,
      metadata: metadata
    })
    setDraftedPost({
      user_id: session?.user.id,
      type: 'general',
      content: '',
      metadata: null
    }); // Reset text area after submission
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' marginBlock='5%' >
      <Heading>Music Tracker for Spotify</Heading>
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
          colorScheme='teal'
          onClick={handlePostSubmit}
        >
          Post
        </Button>
      </Box>
      <Box flexDirection='column' width='60%'>

        {posts?.map((post) => {
          return (
            <Box 
              key={post.id}
              p={4} 
              mb={6} 
              bg='white' 
              boxShadow='md'
              borderRadius='md'
            >
              <Text>{post.user.username}</Text>
              <Text fontSize="lg" mb={2} fontWeight="bold">{post.content}</Text>
              {post.type == 'recentlyPlayed' ? (
                <>
                  <Text fontSize="md" fontWeight="semibold">Recently Played Songs:</Text>
                  {post?.metadata.slice(0, 3).map((song, index) => (
                    <Flex key={index} alignItems="center" mb={2}>
                      <Image 
                        src={song.album.images[0]?.url} 
                        alt={song.name} 
                        boxSize="40px" 
                        borderRadius="md" 
                        mr={3}
                      />
                      <Link href={song.external_urls.spotify} target='_blank'>
                        <Text>{song.name}</Text>
                      </Link>
                    </Flex>
                  ))}
                  <Button onClick={() => openModal(post)}>View More</Button>
                </>
              ) : null}
            </Box>
          )
        })}
      </Box>
      {selectedPost && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Recently Played Songs</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedPost?.metadata.map((song, index) => (
                <Text key={index}>{song.name}</Text>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={closeModal}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};