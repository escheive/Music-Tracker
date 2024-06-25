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
  Box,
} from '@chakra-ui/react';

interface TrackProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrack: any;
  setSelectedTrack: (track: Record<string, any> | null) => void;
}

export const Track: React.FC<TrackProps> = ({ isOpen, onClose, selectedTrack, setSelectedTrack }) => {

  const handleClose = () => {
    setSelectedTrack(null);
    onClose();
  }

  const formatDuration = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds}s`;
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
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
            <Image
              src={selectedTrack?.track.album.images[0].url} 
              boxSize={{base: '50px', md: '60px'}} 
              fallbackSrc='https://via.placeholder.com/150' 
              m='3'
              position='absolute'
            />
            <ModalHeader textAlign='center'>{selectedTrack?.track.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              _hover={{ background: 'gray.200'}} 
              mb='1'
            >
              <Text>Popularity: {selectedTrack.track.popularity}</Text>
              <Text>Duration: {formatDuration(selectedTrack.track.duration_ms)}</Text>
              {selectedTrack.track.artists?.map((artist) => (
                <>
                  <Text>{artist.name}</Text>
                </>
              ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='purple' mr={3} onClick={handleClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}