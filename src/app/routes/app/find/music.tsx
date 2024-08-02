import { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Spinner,
  Image as ChakraImage,
  Text,
  AlertIcon,
  Alert,
  SimpleGrid,
  useBreakpointValue,
  Collapse,
  Link
} from '@chakra-ui/react';
import { useSpotifySearch } from '@api/spotify/spotify';
import spotifyIcon from '@assets/spotify/icons/Spotify_Icon_RGB_White.png';
import { GeneralSearchForm } from '@features/find/components/GeneralSearchForm';
import { FeatureSearchForm } from '@features/find/components/FeatureSearchForm';

export const FindMusicRoute = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('album,artist,track');
  const [search, setSearch] = useState({
    term: '',
    type: 'album,artist,track'
  });
  const [searchType, setSearchType] = useState('general');
  const [expandedCategories, setExpandedCategories] = useState({
    album: true,
    artist: true,
    track: true
  });
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  // const [searchType, setSearchType] = useState('general');

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleSearch = (searchParams: Record<string, any>) => {
    const queryParts = ['limit:50'];
    if (searchParams.query) queryParts.push(searchParams.query);
    if (searchParams.artist) queryParts.push(`artist:${searchParams.artist}`);
    if (searchParams.album) queryParts.push(`album:${searchParams.album}`);
    if (searchParams.track) queryParts.push(`track:${searchParams.track}`);
    if (searchParams.year) queryParts.push(`year:${searchParams.year}`);
    if (searchParams.genre) queryParts.push(`genre:${searchParams.genre}`);
    if (searchParams.isrc) queryParts.push(`isrc:${searchParams.isrc}`);
    if (searchParams.upc) queryParts.push(`upc:${searchParams.upc}`);
    if (searchParams.tag) queryParts.push(`tag:${searchParams.tag}`);
    if (searchParams.valence) queryParts.push(`valence:${searchParams.valence}`);
    if (searchParams.tempo) queryParts.push(`tempo:${searchParams.tempo}`);
    
    setSearch({
      term: queryParts.join(' '),
      type: searchParams.type || type
    });
  };

  const toggleExpandCategory = (category: 'album' | 'artist' | 'track') => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  const breakpointColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  const renderItems = (items: Record<string, any>[], type: string) => {
    return items.map((item: Record<string, any>) => (
      <Box 
        key={item.id} 
        p={4} 
        borderWidth={1} 
        borderRadius='lg' 
        boxShadow='lg' 
        mb={4} 
        bg='gray.800' 
        color='white'
        position='relative'
      >
        <Box 
          onClick={() => toggleExpand(item.id)} 
          cursor='pointer' 
          display='flex' 
          alignItems='center'
        >
          <ChakraImage
            src={type !== 'track' ? item.images[0]?.url : item.album?.images[0]?.url}
            alt={item.name}
            boxSize='150px'
            objectFit='cover'
            borderRadius='md'
          />
          <Box ml={4}>
            <Text fontSize='xl' fontWeight='bold'>{item.name}</Text>
            {type === 'album' && <Text fontSize='md'>{item.artists.map((artist: Record<string, any>) => artist.name).join(', ')}</Text>}
            {type === 'artist' && <Text fontSize='md'>Genres: {item.genres.join(', ')}</Text>}
            {type === 'artist' && <Text fontSize='md'>Followers: {item.followers.total}</Text>}
            {type === 'track' && <Text fontSize='md'>Artist: {item.artists.map((artist: Record<string, any>) => artist.name).join(', ')}</Text>}
            {type === 'track' && <Text fontSize='md'>Album: {item.album.name}</Text>}
          </Box>
        </Box>
        <Collapse in={expandedItem === item.id}>
          <Box mt={4} p={4} borderWidth={1} borderRadius='md' boxShadow='md' bg='gray.700'>
            {type === 'album' && (
              <>
                <Text>Release Date: {item.release_date}</Text>
                <Text>Genre: {item.genres?.join(', ')}</Text>
                <Text>Album Type: {item.album_type}</Text>
                <Text>Tracks: {item.total_tracks}</Text>
                <Link href={item.external_urls.spotify} target='_blank' color='teal.300'>Check out on Spotify</Link>
              </>
            )}
            {type === 'artist' && (
              <>
                <Text>Popularity: {item.popularity}</Text>
                <Text>Followers: {item.followers.total}</Text>
                <Text>Genres: {item.genres.join(', ')}</Text>
                <Link href={item.external_urls.spotify} target='_blank' color='teal.300'>Check out on Spotify</Link>
              </>
            )}
            {type === 'track' && (
              <>
                <Text>Duration: {Math.floor(item.duration_ms / 60000)}:{Math.floor((item.duration_ms % 60000) / 1000).toString().padStart(2, '0')}</Text>
                <Text>Popularity: {item.popularity}</Text>
                <Text>Album: {item.album.name}</Text>
                <Link href={item.external_urls.spotify} target='_blank' color='teal.300'>Check out on Spotify</Link>
              </>
            )}
          </Box>
        </Collapse>
        <ChakraImage 
          src={spotifyIcon} 
          alt='Spotify Icon' 
          position='absolute' 
          bottom={expandedItem === item.id ? 6 : 2} 
          right={expandedItem === item.id ? 6 : 2} 
          boxSize='40px' 
        />
      </Box>
    ));
  };

  const { data, error, isLoading } = useSpotifySearch(search);

  return (
    <Box width='100%' mx='auto' mt={4} p={4}>
      <Heading mb={4}>Find Music</Heading>
      <Box mb={4}>
        <Button
          onClick={() => setSearchType('general')}
          mr={2}
          colorScheme={searchType === 'general' ? 'teal' : 'gray'}
        >
          General Search
        </Button>
        <Button
          onClick={() => setSearchType('features')}
          colorScheme={searchType === 'features' ? 'teal' : 'gray'}
        >
          Search by Features
        </Button>
      </Box>
      {searchType === 'general' ? (
        <GeneralSearchForm 
          query={query}
          type={type}
          setQuery={setQuery}
          setType={setType}
        />
      ) : (
        <FeatureSearchForm onSearch={handleSearch} />
      )}

      {isLoading && <Spinner size='xl' mt={4} />}

      {error && (
        <Alert status='error' mt={4}>
          <AlertIcon />
          Error: {error.message}
        </Alert>
      )}

      {data && (
        <Box mt={4}>
          {type.includes('album') && data.albums?.items.length > 0 && (
            <>
              <Heading size='md' mb={2}>Albums</Heading>
              <Button onClick={() => toggleExpandCategory('album')} mb={4}>
                {expandedCategories.album ? 'Minimize albums' : 'Expand albums'}
              </Button>
              <Collapse in={expandedCategories.album}>
                <SimpleGrid columns={breakpointColumns} spacing={4} mb={4}>
                  {renderItems(data.albums.items, 'album')}
                </SimpleGrid>
              </Collapse>
              {expandedCategories.album && <Button onClick={() => toggleExpandCategory('album')} mb={4}>
                {expandedCategories.album ? 'Minimize albums' : 'Expand albums'}
              </Button>}
            </>
          )}
          {type.includes('artist') && data.artists?.items.length > 0 && (
            <>
              <Heading size='md' mb={2}>Artists</Heading>
              <Button onClick={() => toggleExpandCategory('artist')} mb={4}>
                {expandedCategories.artist ? 'Minimize Artists' : 'Expand Artists'}
              </Button>
              <Collapse in={expandedCategories.artist}>
                <SimpleGrid columns={breakpointColumns} spacing={4} mb={4}>
                  {renderItems(data.artists.items, 'artist')}
                </SimpleGrid>
              </Collapse>
              {expandedCategories.artist && <Button onClick={() => toggleExpandCategory('artist')} mb={4}>
                {expandedCategories.artist ? 'Minimize Artists' : 'Expand Artists'}
              </Button>}
            </>
          )}
          {type.includes('track') && data.tracks?.items.length > 0 && (
            <>
              <Heading size='md' mb={2}>Tracks</Heading>
              <Button onClick={() => toggleExpandCategory('track')} mb={4}>
                {expandedCategories.track ? 'Minimize Tracks' : 'Expand Tracks'}
              </Button>
              <Collapse in={expandedCategories.track}>
                <SimpleGrid columns={breakpointColumns} spacing={4} mb={4}>
                  {renderItems(data.tracks.items, 'track')}
                </SimpleGrid>
              </Collapse>
              {expandedCategories.track && <Button onClick={() => toggleExpandCategory('track')} mb={4}>
                {expandedCategories.track ? 'Minimize tracks' : 'Expand tracks'}
              </Button>}
            </>
          )}
        </Box>
      )}
    </Box>
  );
};
