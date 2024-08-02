import { Container, Flex, Box, Text, Image, Link } from '@chakra-ui/react';
import spotifyLogo from '@assets/spotify/logos/Spotify_Logo_RGB_Black.png';

interface Song {
  id: string;
  name: string;
  imageUrl: string;
  spotifyUrl: string;
}

interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  spotifyUrl: string;
}

interface TopItemsMetadata {
  artists: Artist[];
  tracks: Song[];
}

interface RecentlyPlayedProps {
  metadata: Song[];
}

interface TopItemsProps {
  metadata: TopItemsMetadata;
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ metadata }) => (
  <>
    <Text fontSize='md' fontWeight='semibold'>Recently Played Songs:</Text>
    {metadata.slice(0, 3).map((song, index) => (
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
);

const TopItems: React.FC<TopItemsProps> = ({ metadata }) => (
  <Flex>
    <Box flex='1' mr={4}>
      <Text fontSize='lg' fontWeight='semibold' mb={2}>My Top Artists</Text>
      {metadata.artists.map((artist, index) => (
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
      {metadata.tracks.map((track, index) => (
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
);

export const PostMetadata = ({ post }: Record<string, any>) => (
  <Container boxShadow='sm' borderRadius='md' variant='post'>
    {post.type === 'recentlyPlayed' && <RecentlyPlayed metadata={post.metadata} />}
    {post.type === 'topItems' && <TopItems metadata={post.metadata} />}
    <Image src={spotifyLogo} alt={'Spotify logo'} height='30px' borderRadius='md' marginTop={3} />
  </Container>
);
