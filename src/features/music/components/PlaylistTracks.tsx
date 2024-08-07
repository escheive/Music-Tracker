import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  Image,
  Flex,
  Skeleton,
} from '@chakra-ui/react';
import { useSpotifyPlaylistsTracks } from '@api/spotify/spotify';
import React, { useEffect, useState } from 'react';

interface PlaylistTracksProps {
  isOpen: boolean;
  onClose: () => void;
  setSelectedTrack: (track: Record<string, any> | null) => void;
  playlist: {
    id: string;
    name: string;
    tracks: {
      total: number;
    }
  };
}

export const PlaylistTracks: React.FC<PlaylistTracksProps> = ({ isOpen, onClose, playlist, setSelectedTrack }) => {
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
      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        isCentered 
        scrollBehavior='inside' 
        size='xl'
      >
        <ModalOverlay 
          bg='none'
          backdropFilter='auto'
          backdropInvert='80%'
          backdropBlur='2px'
          />
        <ModalContent>
          <ModalHeader textAlign='center'>{playlist?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody onScroll={(e) => handleOnScroll(e)}>
            {allTracks.length > 0 ? (
              <>
                {allTracks.map((track: Record<string, any>) => (
                  <Flex 
                    key={track.track.id} 
                    _hover={{ background: 'gray.200', cursor: 'pointer' }} 
                    mb='1'
                    onClick={() => handleTrackClick(track)}
                  >
                    <Image
                      src={track.track.album.images[0].url} 
                      boxSize={{base: '30px', md: '40px'}} 
                      fallbackSrc='https://via.placeholder.com/150' 
                    />
                    <Text fontWeight='bold' key={track.track.id}>
                      {track.track.name}
                    </Text>
                  </Flex>
                ))}
              </>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='purple' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}