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

export const PlaylistTracks = ({ isOpen, onClose, playlist }) => {
  const { data: tracks } = useSpotifyPlaylistsTracks(playlist?.id);
  console.log(tracks)

  return (
    <>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{playlist ? playlist.title : null}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {tracks ? (
              <>
                {tracks.items.map((track: any) => (
                  <Flex>
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
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}