import { useEffect, useState, useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, Box, Flex, Text, Container, Image, Link, VStack, Textarea, Avatar } from '@chakra-ui/react';
import { useSupabaseCommentsInfinite, useSupabasePostsInfinite, useSupabaseProfile } from "@api/supabase/fetch/fetch";
import { useAuthContext } from "@context/AuthProvider";
import spotifyLogo from '@assets/spotify/logos/Spotify_Logo_RGB_Black.png';
import { ChatIcon, CopyIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { useInView } from 'react-intersection-observer';
import { useSWRConfig } from 'swr';


// Post List Component
export const PostList = () => {
  const { session } = useAuthContext();
  const [selectedPost, setSelectedPost] = useState(null);
  const { data: posts, setSize, size, error: postsError } = useSupabasePostsInfinite(session?.user.id);
  const { ref, inView } = useInView();
  const [hasMore, setHasMore] = useState(true); // Flag to track if all posts are loaded
  
  // Combine all pages of posts into one array
  const allPosts = posts ? posts.flat() : [];

  // Load more posts when the last element comes into view
  useEffect(() => {
    if (inView && hasMore && posts && posts.length > 0) {
      setSize(size + 1);
    }
  }, [inView]);

  useEffect(() => {
    // Check if there are no more posts to load
    if (posts && posts[posts.length - 1] && posts[posts.length - 1].length < 10) {
      setHasMore(false);
    }
  }, [posts]);

  if (postsError) return <Text>Error fetching posts</Text>;

  return (
    <Box flexDirection='column' width={['100%', '80%']}>

      {allPosts?.map((post) => {

        return (
          <Post 
            key={post.id} 
            post={post} 
            setSelectedPost={() => setSelectedPost(post)}
          />
        )
      })}
      <div ref={ref} />
      {selectedPost && (
        <PostModal post={selectedPost} setSelectedPost={setSelectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </Box>
  );
};

// Post Modal Component
const PostModal = ({ post, setSelectedPost, onClose }) => {
  const { session } = useAuthContext();
  const { data: profile } = useSupabaseProfile(session?.user.id);
  // const { getCommentsForPost } = useSupabasePostsInfinite(session?.user.id);
  const { data, size, setSize, addComment, mutate } = useSupabaseCommentsInfinite(post.id);
  // Combine all pages of data into one array
  const comments = data ? data.flat() : [];
  // const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const userId = profile?.id;
    const username = profile?.username;
    if (userId && newComment.trim()) {
      await addComment(userId, username, post.id, newComment);
      setNewComment('');
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} size='3xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p={4}>
          <Post post={post} setSelectedPost={setSelectedPost} />
          <Box mt={4}>
            <form onSubmit={handleCommentSubmit}>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                mb={2}
              />
              <Button type="submit" colorScheme="blue">Post Comment</Button>
            </form>
          </Box>
          <Box mt={4}>
            {comments.map(comment => (
              <Box key={comment.id} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
                <Flex alignItems="center">
                  {/* <Avatar size="sm" name={comment.username} src={comment.avatar_url} mr={3} /> */}
                  <Box>
                    <Text fontWeight="bold">{comment.Profiles?.username}</Text>
                    <Text fontSize="sm" color="gray.500">{new Date(comment.created_at).toLocaleString()}</Text>
                  </Box>
                </Flex>
                <Text mt={2}>{comment.content}</Text>
              </Box>
            ))}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};


export const Post = ({ post, setSelectedPost }) => {
  const { session }  = useAuthContext();
  const { data: profile } = useSupabaseProfile(session?.user.id);
  const { likePost, unlikePost } = useSupabasePostsInfinite(profile?.id);

  const postedAt = new Date(post.created_at).toLocaleString();

  const handleLike = async (postId, userLiked) => {
    if (!userLiked) {
      await likePost(profile?.id, postId)
    } else {
      await unlikePost(profile?.id, postId)
    }
  }

  return (
    <Box 
      key={post.id}
      mb={6} 
      bg='white' 
      boxShadow='md'
      borderRadius='md'
      onClick={() => setSelectedPost(post)}
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
          onClick={() => handleLike(post.id, post.user_liked)}
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
          <Text>{post?.comment_count}</Text>
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
  );
};
