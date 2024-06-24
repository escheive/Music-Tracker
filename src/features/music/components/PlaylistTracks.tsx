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
  console.log(playlist)

  return (
    <>
      <Modal 
        blockScrollOnMount={false} 
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
          <ModalBody onScroll={() => console.log('scrolling')}>
            {tracks ? (
              <>
                {tracks.items.map((track: any) => (
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