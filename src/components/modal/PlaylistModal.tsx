import {
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Image,
  Flex,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  Box,
} from '@chakra-ui/react';
import { useSpotifyPlaylistsTracks } from '@api/spotify/spotify';
import React, { useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';
import spotifyLogo from '@assets/spotify/logos/Spotify_Logo_RGB_Black.png';

interface PlaylistTracksProps {
  setSelectedTrack: (track: Record<string, any> | null) => void;
  playlist: Record<string, any> | null;
}

  const formatDuration = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds}s`;
  };

export const PlaylistTracksModal: React.FC<PlaylistTracksProps> = ({ playlist, setSelectedTrack }) => {
  if (!playlist) return

  const [offset, setOffset] = useState(0);
  const [allTracks, setAllTracks] = useState<object[]>([]);
  const { data: tracks, isLoading: tracksLoaded } = useSpotifyPlaylistsTracks(playlist?.id, offset);
  const totalTracks = playlist?.tracks.total;

  const handleOnScroll = (e: any) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      if (allTracks.length < playlist.tracks.total) {
        setOffset((prevOffset) => prevOffset + 100);
      }
    }
  }

  // const handleTrackClick = (track: Record<string, any>) => {
  //   setSelectedTrack(track)
  // }

  useEffect(() => {
    if (playlist?.id) {
      setOffset(0); // Reset offset when playlist changes
      setAllTracks([]); // Clear the tracks when a new playlist is opened
    }
  }, [playlist?.id]);

  useEffect(() => {
    if (tracks && tracks.items) {
      setAllTracks((prevTracks: object[]) => [...prevTracks, ...tracks.items]);
    }
  }, [tracks]);

  return (
    <>
      <ModalHeader textAlign='center'>{playlist?.name}</ModalHeader>
      <Image 
        src={spotifyLogo} 
        objectFit='contain'
        height='30px'
        fallbackSrc='https://via.placeholder.com/150' 
      />
      <ModalCloseButton />
      <ModalBody onScroll={(e) => handleOnScroll(e)}>
          <TableContainer whiteSpace='wrap' height='100vh' overflowY='auto'>
          <Table variant='striped' colorScheme='alternatePurple'>
            <Thead>
              <Tr>
                <Th fontSize={{base: '16', md: '18'}}>Title</Th>
                <Th fontSize={{base: '16', md: '18'}}>Album</Th>
                <Th fontSize={{base: '16', md: '18'}}>Added</Th>
                <Th fontSize={{base: '16', md: '18'}}>Duration</Th>
              </Tr>
            </Thead>
            {allTracks.length > 0 ? (
            <Tbody>
              {allTracks?.map((item: Record<string, any>, i: number) => {
                const songDuration = formatDuration(item?.track.duration_ms)
                const parsedDate = parseISO(item?.added_at);
                const formattedDate = format(parsedDate, 'MMMM d, yyyy');

                return (
                  <Tr key={`recently played ${item.track.name, i}`} height='auto' w='100%'>
                    <Td>
                      <Link href={item.track.external_urls?.spotify} target='_blank'>
                        <Flex alignItems="center" flexDirection="row">
                          <Image 
                            src={item?.track.album.images[0]?.url} 
                            objectFit='contain'
                            height='60px'
                            fallbackSrc='https://via.placeholder.com/150' 
                            mr={3}
                          />
                          <Box>
                            <Text fontWeight="bold">{item.track.name}</Text>
                            <Text>{item.track.artists[0]?.name}</Text>
                          </Box>
                        </Flex>
                      </Link>
                    </Td>
                    <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}>
                      <Link href={item.track.album.external_urls?.spotify} target='_blank'>
                        {item?.track.album.name}
                      </Link>
                    </Td>
                    <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}>
                      {formattedDate}
                    </Td>
                    <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}>
                      {songDuration}
                    </Td>   
                  </Tr>
                )
              })}
            </Tbody>
            ) : (
              <>
                {Array.from({ length: totalTracks}).map((_: any, index: number) => (
                    <Skeleton 
                      key={`skeleton ${index}`}
                      isLoaded={!tracksLoaded} 
                      height='20px' 
                      mb='1rem'
                    />
                ))}
              </>
            )}
          </Table>
        </TableContainer>
      </ModalBody>
    </>
  )
}