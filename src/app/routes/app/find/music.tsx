import { Key, useState } from 'react';
import {
  Box,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  Heading,
  Stack,
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

export const FindMusicRoute = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('album,artist,track');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [track, setTrack] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [tag, setTag] = useState('');
  const [isrc, setIsrc] = useState('');
  const [upc, setUpc] = useState('');
  const [search, setSearch] = useState({
    term: '',
    type: 'album,artist,track'
  });
  const [expandedCategories, setExpandedCategories] = useState({
    album: true,
    artist: true,
    track: true
  });
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const queryParts = ['limit:50'];
    if (query) queryParts.push(query);
    if (artist) queryParts.push(`artist:${artist}`);
    if (album) queryParts.push(`album:${album}`);
    if (track) queryParts.push(`track:${track}`);
    if (year) queryParts.push(`year:${year}`);
    if (genre) queryParts.push(`genre:${genre}`);
    if (isrc) queryParts.push(`isrc:${isrc}`);
    if (upc) queryParts.push(`upc:${upc}`);
    if (tag) queryParts.push(`tag:${tag}`);
    setSearch({
      term: queryParts.join(' '),
      type: type
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
            {type === 'album' && <Text fontSize='md'>{item.artists.map(artist => artist.name).join(', ')}</Text>}
            {type === 'artist' && <Text fontSize='md'>Genres: {item.genres.join(', ')}</Text>}
            {type === 'artist' && <Text fontSize='md'>Followers: {item.followers.total}</Text>}
            {type === 'track' && <Text fontSize='md'>Artist: {item.artists.map(artist => artist.name).join(', ')}</Text>}
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
      <form onSubmit={handleSearch}>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <FormControl id='query'>
            <FormLabel>Search Query</FormLabel>
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='General search query'
            />
          </FormControl>
          <FormControl id='type'>
            <FormLabel>Type</FormLabel>
            <Select 
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value='album,artist,track'>All</option>
              <option value='album'>Album</option>
              <option value='artist'>Artist</option>
              <option value='track'>Track</option>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={4}>
          <FormControl id='artist'>
            <FormLabel>Artist</FormLabel>
            <Input 
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder='Artist name'
            />
          </FormControl>
          <FormControl id='album'>
            <FormLabel>Album</FormLabel>
            <Input 
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder='Album name'
            />
          </FormControl>
          <FormControl id='track'>
            <FormLabel>Track</FormLabel>
            <Input 
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              placeholder='Track name'
            />
          </FormControl>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={4}>
          <FormControl id='year'>
            <FormLabel>Year</FormLabel>
            <Input 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder='Year or range (e.g., 1955-1960)'
            />
          </FormControl>
          <FormControl id='genre'>
            <FormLabel>Genre</FormLabel>
            <Input 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder='Genre'
            />
          </FormControl>
          <FormControl id='isrc'>
            <FormLabel>ISRC</FormLabel>
            <Input 
              value={isrc}
              onChange={(e) => setIsrc(e.target.value)}
              placeholder='ISRC code'
            />
          </FormControl>
          <FormControl id='upc'>
            <FormLabel>UPC</FormLabel>
            <Input 
              value={upc}
              onChange={(e) => setUpc(e.target.value)}
              placeholder='UPC code'
            />
          </FormControl>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={4}>
          <FormControl id='tag'>
            <FormLabel>Tag</FormLabel>
            <Select 
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value=''>None</option>
              <option value='hipster'>Hipster</option>
              <option value='new'>New</option>
            </Select>
          </FormControl>
        </Stack>
        <Button mt={4} type='submit'>Search</Button>
      </form>

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
