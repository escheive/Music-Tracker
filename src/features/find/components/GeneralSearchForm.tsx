import { Dispatch, SetStateAction, useState } from 'react';
import {
  Box,
  Input,
  Button,
  Select,
  FormControl,
  FormLabel,
  Heading,
  Stack,
} from '@chakra-ui/react';

interface GeneralSearchFormProps {
  query: string;
  type: string;
  onSearch: (searchParams: Record<string, string>) => void;
  setQuery: Dispatch<SetStateAction<string>>
  setType: Dispatch<SetStateAction<string>>
}

export const GeneralSearchForm: React.FC<GeneralSearchFormProps> = ({ query, type, onSearch, setQuery, setType }) => {
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [track, setTrack] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [tag, setTag] = useState('');
  const [isrc, setIsrc] = useState('');
  const [upc, setUpc] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSearch({
      query,
      artist,
      album,
      track,
      year,
      genre,
      tag,
      isrc,
      upc,
    });
  };

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
    </Box>
  );
};
