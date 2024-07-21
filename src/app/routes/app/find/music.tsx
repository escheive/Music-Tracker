import React, { useState } from 'react';
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
  Image,
  Text,
  AlertIcon,
  Alert,
  SimpleGrid,
  useBreakpointValue,
  Collapse
} from '@chakra-ui/react';
import { useSpotifySearch } from '@api/spotify/spotify';

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
  const [expandAlbums, setExpandAlbums] = useState(false);
  const [expandArtists, setExpandArtists] = useState(false);
  const [expandTracks, setExpandTracks] = useState(false);

  const handleSearch = (e) => {
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

  const breakpointColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  const renderItems = (items, type) => {
    return items.map(item => (
      <Box key={item.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
        {type === 'album' && (
          <Box>
            <Image src={item.images[0]?.url} alt={item.name} boxSize="150px" objectFit="cover" />
            <Text mt={2} fontWeight="bold">{item.name}</Text>
            <Text>{item.artists.map(artist => artist.name).join(', ')}</Text>
            <Text>Release Date: {item.release_date}</Text>
            <Text>Genre: {item.genres?.join(', ')}</Text>
          </Box>
        )}
        {type === 'artist' && (
          <Box>
            <Image src={item.images[0]?.url} alt={item.name} boxSize="150px" objectFit="cover" />
            <Text mt={2} fontWeight="bold">{item.name}</Text>
            <Text>Genres: {item.genres.join(', ')}</Text>
            <Text>Followers: {item.followers.total}</Text>
          </Box>
        )}
        {type === 'track' && (
          <Box>
            <Image src={item.album.images[0]?.url} alt={item.name} boxSize="150px" objectFit="cover" />
            <Text mt={2} fontWeight="bold">{item.name}</Text>
            <Text>Artist: {item.artists.map(artist => artist.name).join(', ')}</Text>
            <Text>Album: {item.album.name}</Text>
            <Text>Duration: {Math.floor(item.duration_ms / 60000)}:{Math.floor((item.duration_ms % 60000) / 1000).toString().padStart(2, '0')}</Text>
          </Box>
        )}
      </Box>
    ));
  };

  const { data, error, isLoading } = useSpotifySearch(search);
  console.log(data)

  return (
    <Box width="100%" maxW="800px" mx="auto" mt={4} p={4}>
      <Heading mb={4}>Find Music</Heading>
      <form onSubmit={handleSearch}>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <FormControl id="query">
            <FormLabel>Search Query</FormLabel>
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="General search query"
            />
          </FormControl>
          <FormControl id="type">
            <FormLabel>Type</FormLabel>
            <Select 
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="album,artist,track">All</option>
              <option value="album">Album</option>
              <option value="artist">Artist</option>
              <option value="track">Track</option>
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={4}>
          <FormControl id="artist">
            <FormLabel>Artist</FormLabel>
            <Input 
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name"
            />
          </FormControl>
          <FormControl id="album">
            <FormLabel>Album</FormLabel>
            <Input 
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="Album name"
            />
          </FormControl>
          <FormControl id="track">
            <FormLabel>Track</FormLabel>
            <Input 
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              placeholder="Track name"
            />
          </FormControl>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={4}>
          <FormControl id="year">
            <FormLabel>Year</FormLabel>
            <Input 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year or range (e.g., 1955-1960)"
            />
          </FormControl>
          <FormControl id="genre">
            <FormLabel>Genre</FormLabel>
            <Input 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre"
            />
          </FormControl>
          <FormControl id="isrc">
            <FormLabel>ISRC</FormLabel>
            <Input 
              value={isrc}
              onChange={(e) => setIsrc(e.target.value)}
              placeholder="ISRC code"
            />
          </FormControl>
          <FormControl id="upc">
            <FormLabel>UPC</FormLabel>
            <Input 
              value={upc}
              onChange={(e) => setUpc(e.target.value)}
              placeholder="UPC code"
            />
          </FormControl>
        </Stack>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mt={4}>
          <FormControl id="tag">
            <FormLabel>Tag</FormLabel>
            <Select 
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option value="">None</option>
              <option value="hipster">Hipster</option>
              <option value="new">New</option>
            </Select>
          </FormControl>
        </Stack>
        <Button mt={4} type="submit">Search</Button>
      </form>

      {isLoading && <Spinner size="xl" mt={4} />}

      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          Error: {error.message}
        </Alert>
      )}

{data && (
        <Box mt={4}>
          {type.includes('album') && data.albums?.items.length > 0 && (
            <>
              <Heading size="md" mb={2}>Albums</Heading>
              <Button onClick={() => setExpandAlbums(!expandAlbums)} mb={4}>
                {expandAlbums ? 'Minimize Albums' : 'Expand Albums'}
              </Button>
              <Collapse in={expandAlbums}>
                <SimpleGrid columns={breakpointColumns} spacing={4} mb={4}>
                  {renderItems(data.albums.items, 'album')}
                </SimpleGrid>
              </Collapse>
              {expandAlbums && <Button onClick={() => setExpandAlbums(!expandAlbums)} mb={4}>
                {expandAlbums ? 'Minimize Albums' : 'Expand Albums'}
              </Button>}
            </>
          )}
          {type.includes('artist') && data.artists?.items.length > 0 && (
            <>
              <Heading size="md" mb={2}>Artists</Heading>
              <Button onClick={() => setExpandArtists(!expandArtists)} mb={4}>
                {expandArtists ? 'Minimize Artists' : 'Expand Artists'}
              </Button>
              <Collapse in={expandArtists}>
                <SimpleGrid columns={breakpointColumns} spacing={4} mb={4}>
                  {renderItems(data.artists.items, 'artist')}
                </SimpleGrid>
              </Collapse>
              {expandArtists && <Button onClick={() => setExpandArtists(!expandArtists)} mb={4}>
                {expandArtists ? 'Minimize Artists' : 'Expand Artists'}
              </Button>}
            </>
          )}
          {type.includes('track') && data.tracks?.items.length > 0 && (
            <>
              <Heading size="md" mb={2}>Tracks</Heading>
              <Button onClick={() => setExpandTracks(!expandTracks)} mb={4}>
                {expandTracks ? 'Minimize Tracks' : 'Expand Tracks'}
              </Button>
              <Collapse in={expandTracks}>
                <SimpleGrid columns={breakpointColumns} spacing={4} mb={4}>
                  {renderItems(data.tracks.items, 'track')}
                </SimpleGrid>
              </Collapse>
              {expandTracks && <Button onClick={() => setExpandTracks(!expandTracks)} mb={4}>
                {expandTracks ? 'Minimize Tracks' : 'Expand Tracks'}
              </Button>}
            </>
          )}
        </Box>
      )}

      {/* {data && (
        <Box mt={4}>
          {type.includes('album') && data.albums?.items.length > 0 && (
            <>
              <Heading size="md" mb={4}>Albums</Heading>
              <SimpleGrid columns={breakpointColumns} spacing={4} mb={4}>
                {renderItems(data.albums.items, 'album')}
              </SimpleGrid>
            </>
          )}
          {type.includes('artist') && data.artists?.items.length > 0 && (
            <>
              <Heading size="md" mb={4}>Artists</Heading>
              <SimpleGrid columns={breakpointColumns} spacing={4} mb={4}>
                {renderItems(data.artists.items, 'artist')}
              </SimpleGrid>
            </>
          )}
          {type.includes('track') && data.tracks?.items.length > 0 && (
            <>
              <Heading size="md" mb={4}>Tracks</Heading>
              <SimpleGrid columns={breakpointColumns} spacing={4} mb={4}>
                {renderItems(data.tracks.items, 'track')}
              </SimpleGrid>
            </>
          )}
        </Box>
      )} */}
    </Box>
  );
};
