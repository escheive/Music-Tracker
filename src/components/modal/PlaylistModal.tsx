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
import { TableComponent } from '@components/list/TableComponent';

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
  console.log(allTracks)
  console.log(playlist)

  const handleOnScroll = (e: any) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      if (allTracks.length < playlist.tracks.total) {
        setOffset((prevOffset) => prevOffset + 100);
      }
    }
  }

  const handleTrackClick = (track: Record<string, any>) => {
    setSelectedTrack(track)
  }

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
  
                return (
                  <Tr key={`recently played ${item.track.name, i}`} height='auto' w='100%'>
                    <Td>
                      <Link href={item.track.external_urls?.spotify} target='_blank'>
                        <Flex alignItems="center" flexDirection="row">
                          <Image 
                            src={item?.track.album.images[0]?.url} 
                            objectFit='contain'
                            boxSize={{ sm: '26px', base: '36px', md: '48px'}}
                            minWidth='26px'
                            fallbackSrc='https://via.placeholder.com/150' 
                            mr={3} // Add some margin to the right of the image
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
                      {item.added_at}
                    </Td>
                    <Td fontSize={{ sm: '12px', base: '16px', md: '18px'}}>
                      {item?.track.duration_ms}
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

// <>
          //   {allTracks.map((track: Record<string, any>) => {
          //     const addedDate = track?.added_at;
          //     let formattedDate = "-";
          //     if (addedDate) {
          //       const parsedDate = parseISO(addedDate);
          //       formattedDate = format(parsedDate, 'MMMM d, yyyy');
          //     }

          //     return (

          //       <Flex 
          //         key={track.track.id} 
          //         _hover={{ background: 'gray.200', cursor: 'pointer' }} 
          //         mb='1'
          //         justifyContent='space-between'
          //         onClick={() => handleTrackClick(track)}
          //       >
          //         <Image
          //           src={track.track.album.images[0].url} 
          //           boxSize={{base: '30px', md: '40px'}} 
          //           fallbackSrc='https://via.placeholder.com/150' 
          //         />
          //         <Text fontWeight='bold' key={track.track.id}>
          //           {track.track.name}
          //         </Text>
          //         <Text>
          //           {track.track.album.name}
          //         </Text>
          //         <Text>
          //           {formattedDate}
          //         </Text>
          //         <Text>
          //           {formatDuration(track.track.duration_ms)}
          //         </Text>
          //       </Flex>
          //     )
          //   })}
          // </>