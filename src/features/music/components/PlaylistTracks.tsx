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
  Box,
  Image,
  Flex
} from '@chakra-ui/react';
import { useSpotifyPlaylistsTracks } from '@/api/spotify';
import { useEffect, useState } from 'react';

export const PlaylistTracks = ({ isOpen, onClose, playlist }) => {
  const [offset, setOffset] = useState(0);
  const [allTracks, setAllTracks] = useState([]);
  const { data: tracks } = useSpotifyPlaylistsTracks(playlist?.id, offset);
  console.log(tracks)
  console.log(playlist)

  const handleOnScroll = (e: any) => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      console.log('the end')
      setOffset((prevOffset) => prevOffset + 100);
    }
    // console.log(e.target.scrollHeight)
    // console.log(e.target.scrollTop)
    // console.log(e.target.clientHeight)
  }

  useEffect(() => {
    if (playlist?.id) {
      setOffset(0); // Reset offset when playlist changes
      setAllTracks([]); // Clear the tracks when a new playlist is opened
    }
  }, [playlist?.id]);

  useEffect(() => {
    if (tracks && tracks.items) {
      setAllTracks((prevTracks) => [...prevTracks, ...tracks.items]);
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
          <ModalHeader textAlign='center'>{playlist ? playlist.name : null}</ModalHeader>
          <ModalCloseButton />
          <ModalBody onScroll={(e) => handleOnScroll(e)}>
            {allTracks ? (
              <>
                {allTracks.map((track: any) => (
                  <Flex key={track.track.id}>
                    <Image 
                      src={track.track.album.images[0].url} 
                      boxSize={{base: '40px', md: '60px'}} 
                      fallbackSrc='https://via.placeholder.com/150' 
                    />
                    <Text fontWeight='bold' mb='1rem' key={track.track.id}>
                      {track.track.name}
                    </Text>
                  </Flex>
                ))}
              </>
            ) : null}
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