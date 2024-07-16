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
  VStack,
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
  Container,
} from '@chakra-ui/react';
import { TriangleUpIcon, ChatIcon, CopyIcon } from '@chakra-ui/icons';

import { useRecentlyPlayedSongs, useUsersTopItems } from '@api/spotify/spotify';
import { useAuthContext } from '@context/AuthProvider';
import { useEffect, useState } from 'react';
import { createPost } from '@api/supabase/insert';
import { useSupabasePostsInfinite, useSupabaseProfile } from "@api/supabase/fetch/fetch";
import { useInView } from 'react-intersection-observer';
import spotifyLogo from '@assets/spotify/logos/Spotify_Logo_RGB_Black.png';
import { addLike } from '@api/supabase/insert';


export const DashboardRoute = () => {
  const { session } = useAuthContext();
  // const { data: posts, mutate: postsMutate, error: errorMutate } = useSupabasePosts();
  const { data: recentlyPlayedSongs } = useRecentlyPlayedSongs();
  const { data: topItems } = useUsersTopItems();
  const { data: profile } = useSupabaseProfile(session?.user.id);
  const [draftedPost, setDraftedPost] = useState({
    user_id: session?.user.id,
    type: 'general',
    content: '',
    metadata: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Record<string, any> | null>(null);
  const { data, size, setSize, error } = useSupabasePostsInfinite(session?.user.id);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(true); // Flag to track if all posts are loaded

  // Combine all pages of posts into one array
  const posts = data ? data.flat() : [];

  // Load more posts when the last element comes into view
  useEffect(() => {
    if (inView && hasMore && data && data.length > 0) {
      setSize(size + 1);
    }
  }, [inView]);

  useEffect(() => {
    // Check if there are no more posts to load
    if (data && data[data.length - 1] && data[data.length - 1].length < 10) {
      setHasMore(false);
    }
  }, [data]);

  if (error) return <Text>Error fetching posts</Text>;

  const openModal = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const handlePostChange = (e: any) => {
    const { name, value } = 'target' in e ? e.target : { name: 'type', value: e};
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

  const handleLike = async (postId) => {
    await addLike(profile?.id, postId)
  }

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
          onClick={handlePostSubmit}
        >
          Post
        </Button>
      </Box>
      <Box flexDirection='column' width={['100%', '80%']}>

        {posts?.map((post) => {
          const postedAt = new Date(post.created_at).toLocaleString();
          console.log(post)

          return (
            <Box 
              key={post.id}
              mb={6} 
              bg='white' 
              boxShadow='md'
              borderRadius='md'
            >
              <Box p={4}>
                <Flex mb={2} alignItems='center'>
                  <Text fontSize='lg' paddingRight={2} fontWeight='semibold'>{post?.username}</Text>
                  <Text fontSize='sm' fontWeight='semibold'>{postedAt}</Text>
                </Flex>

                <Text fontSize='md' fontWeight='semibold'>{post.content}</Text>
              </Box>
              {post.type !== 'general' ? (
                <Container
                  boxShadow='sm'
                  borderRadius='md'
                  variant='post'
                >
              
                  {post.type == 'recentlyPlayed' ? (
                    <>
                      <Text fontSize='md' fontWeight='semibold'>Recently Played Songs:</Text>
                      {post?.metadata.slice(0, 3).map((song: any, index: number) => (
                        <Flex key={index + song.id} alignItems='center' mb={2}>
                          <Image 
                            src={song.imageUrl} 
                            alt={song.name} 
                            boxSize='40px' 
                            borderRadius='md'
                            mr={3}
                          />
                          <Link href={song.spotifyUrl} target='_blank'>
                            <Text fontSize={['sm', 'md']}>{song.name}</Text>
                          </Link>
                        </Flex>
                      ))}
                      <Button variant='outline' onClick={() => openModal(post)}>View More</Button>
                    </>
                  ) : post.type === 'topItems' ? (
                    <>
                      <Flex>
                        <Box flex='1' mr={4}>
                          <Text fontSize='lg' fontWeight='semibold' mb={2}>My Top Artists</Text>
                          {post?.metadata.artists.map((artist: any, index: number) => (
                            <Flex key={index + artist.id} alignItems='center' mb={2}>
                              <Image 
                                src={artist.imageUrl} 
                                alt={artist.name} 
                                boxSize='40px' 
                                borderRadius='md' 
                                mr={3}
                              />
                              <Link href={artist.spotifyUrl} target='_blank'>
                                <Text fontSize={['sm', 'md']}>{artist.name}</Text>
                              </Link>
                            </Flex>
                          ))}
                        </Box>

                        <Box flex='1'>
                          <Text fontSize='lg' fontWeight='semibold' mb={2}>My Top Tracks</Text>
                          {post?.metadata.tracks.map((track: any, index: number) => (
                            <Flex key={index + track.id} alignItems='center' mb={2}>
                              <Image 
                                src={track.imageUrl} 
                                alt={track.name} 
                                boxSize='40px'
                                borderRadius='md'
                                mr={3}
                              />
                              <Link href={track.spotifyUrl} target='_blank'>
                                <Text fontSize={['sm', 'md']}>{track.name}</Text>
                              </Link>
                            </Flex>
                          ))}
                        </Box>
                      </Flex>
                    </>
                  ) : null}
                <Image 
                  src={spotifyLogo} 
                  alt={'Spotify logo'} 
                  height='30px'
                  borderRadius='md'
                  marginTop={3}
                />
              </Container>
              ) : null}

              <Flex py={4} justifyContent='space-around'>
                <VStack 
                  alignItems='center'
                  color={post.user_liked ? `${profile?.theme}.600` : null}
                  _hover={{ 
                    color: `${profile?.theme}.600`,
                    transform: 'scale(1.1)'
                  }}
                  onClick={() => handleLike(post.id)}
                >
                  <TriangleUpIcon />
                  <Text>{post?.like_count}</Text>
                </VStack>
                <VStack 
                  alignItems='center'
                  _hover={{ 
                    color: `${profile?.theme}.600`,
                    transform: 'scale(1.1)'
                  }}
                >
                  <ChatIcon />
                  <Text>24</Text>
                </VStack>
                <VStack 
                  alignItems='center'
                  _hover={{ 
                    color: `${profile?.theme}.600`,
                    transform: 'scale(1.1)'
                  }}
                >
                  <CopyIcon />
                  <Text>32</Text>
                </VStack>
              </Flex>

            </Box>
          )
        })}
        <div ref={ref} />
      </Box>
      {selectedPost && (
        <Modal isOpen={isModalOpen} onClose={closeModal} size='xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Recently Played Songs</ModalHeader>
            <ModalCloseButton color='alternatePurple.300'/>
            <ModalBody>
              {selectedPost?.metadata.map((song: any, index: number) => (
                <Flex key={index + song.id + 'modal'} alignItems='center' mb={2}>
                  <Image 
                    src={song.imageUrl} 
                    alt={song.name} 
                    boxSize='40px' 
                    borderRadius='md'
                    mr={3}
                  />
                  <Link href={song.spotifyUrl} target='_blank'>
                    <Text fontSize='sm' fontWeight='semibold'>{song.name}</Text>
                    <Text fontSize='sm'>{song.artist}</Text>
                  </Link>
                </Flex>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button backgroundColor='alternatePurple.200' onClick={closeModal}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};