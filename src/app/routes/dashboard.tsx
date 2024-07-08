// import { useNavigate } from 'react-router';
// import { 
//   Box, 
//   Heading, 
//   Text, 
//   FormControl,
//   FormLabel,
//   Textarea,
//   Button, 
//   Radio,
//   RadioGroup,
//   Stack,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalFooter,
//   ModalBody,
//   Flex,
//   Image,
//   Link,
// } from '@chakra-ui/react';

// import { beginLogin } from '@/api/spotify/auth';
// import { useRecentlyPlayedSongs, useSpotifyUser, useUsersTopItems } from '@api/spotify/spotify';
// import { useAuthContext } from '@context/AuthProvider';
// import { useSupabasePosts } from '@api/supabase/fetch';
// import { useState } from 'react';
// import { createPost } from '@api/supabase/insert';


// export const DashboardRoute = () => {
//   const navigate = useNavigate();
//   const { user } = useSpotifyUser();
//   const { session } = useAuthContext();
//   const { data: posts, mutate: postsMutate, error: errorMutate } = useSupabasePosts();
//   const { data: recentlyPlayedSongs } = useRecentlyPlayedSongs();
//   const { data: topItems } = useUsersTopItems();
//   const [draftedPost, setDraftedPost] = useState({
//     user_id: session?.user.id,
//     type: 'general',
//     content: '',
//     metadata: null
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);

//   const openModal = (post) => {
//     setSelectedPost(post);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedPost(null);
//     setIsModalOpen(false);
//   };

//   console.log(posts)

//   const handlePostChange = (e) => {
//     const { name, value } = typeof e === 'object' ? e.target : { name: 'type', value: e};
//     setDraftedPost(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handlePostSubmit = () => {
//     let metadata: any;
//     if (draftedPost.type == 'recentlyPlayed') {
//       metadata = recentlyPlayedSongs;
//     } else if (draftedPost.type == 'topItems') {
//       metadata = topItems;
//     }

//     createPost({
//       ...draftedPost,
//       metadata: metadata
//     })
//     setDraftedPost({
//       user_id: session?.user.id,
//       type: 'general',
//       content: '',
//       metadata: null
//     }); // Reset text area after submission
//   };

//   return (
//     <Box display='flex' flexDirection='column' alignItems='center' marginBlock='5%' >
//       <Heading>Music Tracker for Spotify</Heading>
//       <Box width='100%' maxW='600px' mx='auto' mt={4} p={4}>
//         <FormControl id="post">
//           <FormLabel>What's on your mind?</FormLabel>
//           <Textarea
//             name='content'
//             value={draftedPost.content}
//             onChange={handlePostChange}
//             placeholder='Type your post here...'
//             size='md'
//             resize='vertical'
//           />
//         </FormControl>
//         <FormLabel>Share what you're listening to!</FormLabel>
//         <RadioGroup 
//           name='type' 
//           value={draftedPost.type}
//           onChange={handlePostChange}
//         >
//           <Stack spacing={5} direction='row'>
//             <Radio colorScheme='green' name='type' value='general'>
//               No thanks
//             </Radio>
//             <Radio colorScheme='green' name='type' value='recentlyPlayed'>
//               Recently Played Songs
//             </Radio>
//             <Radio colorScheme='green' value='topItems'>
//               Top Tracks and Artists
//             </Radio>
//           </Stack>
//         </RadioGroup>
//         <Button
//           mt={4}
//           colorScheme='teal'
//           onClick={handlePostSubmit}
//         >
//           Post
//         </Button>
//       </Box>
//       <Box flexDirection='column' width='60%'>

//         {posts?.map((post) => {
//           return (
//             <Box 
//               key={post.id}
//               p={4} 
//               mb={6} 
//               bg='white' 
//               boxShadow='md'
//               borderRadius='md'
//             >
//               <Text>{post.user.username}</Text>
//               <Text fontSize="lg" mb={2} fontWeight="bold">{post.content}</Text>
//               {post.type == 'recentlyPlayed' ? (
//                 <>
//                   <Text fontSize="md" fontWeight="semibold">Recently Played Songs:</Text>
//                   {post?.metadata.slice(0, 3).map((song, index) => (
//                     <Flex key={index} alignItems="center" mb={2}>
//                       <Image 
//                         src={song.album.images[0]?.url} 
//                         alt={song.name} 
//                         boxSize="40px" 
//                         borderRadius="md" 
//                         mr={3}
//                       />
//                       <Link href={song.external_urls.spotify} target='_blank'>
//                         <Text>{song.name}</Text>
//                       </Link>
//                     </Flex>
//                   ))}
//                   <Button onClick={() => openModal(post)}>View More</Button>
//                 </>
//               ) : null}
//             </Box>
//           )
//         })}
//       </Box>
//       {selectedPost && (
//         <Modal isOpen={isModalOpen} onClose={closeModal}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>Recently Played Songs</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               {selectedPost?.metadata.map((song, index) => (
//                 <Text key={index}>{song.name}</Text>
//               ))}
//             </ModalBody>
//             <ModalFooter>
//               <Button colorScheme="blue" onClick={closeModal}>Close</Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>
//       )}
//     </Box>
//   );
// };

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
import { useEffect, useState } from 'react';
import { createPost } from '@api/supabase/insert';
import { useSupabasePostsInfinite } from "@api/supabase/fetch";
import { useInView } from 'react-intersection-observer';


export const DashboardRoute = () => {
  const navigate = useNavigate();
  const { user } = useSpotifyUser();
  const { session } = useAuthContext();
  // const { data: posts, mutate: postsMutate, error: errorMutate } = useSupabasePosts();
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
  const { data, size, setSize, error } = useSupabasePostsInfinite();
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
          onClick={handlePostSubmit}
        >
          Post
        </Button>
      </Box>
      <Box flexDirection='column' width={['100%', '80%']}>

        {posts?.map((post) => {
          const postedAt = new Date(post.created_at).toLocaleString();

          return (
            <Box 
              key={post.id}
              p={4} 
              mb={6} 
              bg='white' 
              boxShadow='md'
              borderRadius='md'
            >
              <Flex mb={2} alignItems='center'>
                <Text fontSize='lg' paddingRight={2} fontWeight='semibold'>{post.user.username}</Text>
                <Text fontSize='sm' fontWeight='semibold'>{postedAt}</Text>
              </Flex>

              <Text fontSize='md' fontWeight='semibold' mb={3}>{post.content}</Text>
              {post.type !== 'general' ? (
                <Box 
                  p={[1, 4]} 
                  mb={[3, 6]} 
                  bg='alternatePurple.50'
                  boxShadow='sm'
                  borderRadius='md'
                >
              
                {post.type == 'recentlyPlayed' ? (
                  <>
                    <Text fontSize='md' fontWeight='semibold'>Recently Played Songs:</Text>
                    {post?.metadata.slice(0, 3).map((song, index) => (
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
                    <Button variant='solid' onClick={() => openModal(post)}>View More</Button>
                  </>
                ) : post.type === 'topItems' ? (
                  <>
                    <Flex>
                      <Box flex='1' mr={4}>
                        <Text fontSize='lg' fontWeight='semibold' mb={2}>My Top Artists</Text>
                        {post?.metadata.artists.map((artist, index) => (
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
                        {post?.metadata.tracks.map((track, index) => (
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
              </Box>
              ) : null}
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
              {selectedPost?.metadata.map((song, index) => (
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