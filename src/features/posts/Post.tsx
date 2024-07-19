import { Box, Flex, Text, Container, Image, Link, VStack, Avatar } from '@chakra-ui/react';
import { useSupabasePostsInfinite, useSupabaseProfile } from "@api/supabase/fetch/fetch";
import { useAuthContext } from "@context/AuthProvider";
import spotifyLogo from '@assets/spotify/logos/Spotify_Logo_RGB_Black.png';
import { ChatIcon, CopyIcon, TriangleUpIcon } from '@chakra-ui/icons';

export const Post = ({ post, setSelectedPost }) => {
  const { session }  = useAuthContext();
  const { data: profile } = useSupabaseProfile(session?.user.id);
  const { likePost, unlikePost } = useSupabasePostsInfinite(profile?.id);

  const postedAt = new Date(post.created_at).toLocaleString();

  const handleLike = async (e, postId, userLiked) => {
    console.log(e)
    e.stopPropagation();
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
          onClick={(e) => handleLike(e, post.id, post.user_liked)}
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
