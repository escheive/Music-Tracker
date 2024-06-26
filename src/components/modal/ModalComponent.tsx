import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useModal,
} from '@chakra-ui/react';
import { useModalContext } from '@/providers/ModalProvider';
import { TrackModal } from './TrackModal';
import { PlaylistTracksModal } from './PlaylistModal';


export const ModalComponent = () => {
  const { selectedTrack, setSelectedTrack, selectedPlaylist, setSelectedPlaylist, isOpen, onClose } = useModalContext();

  const handleClose = () => {

    if (selectedTrack) {
      setSelectedTrack(null);
    } else {
      setSelectedPlaylist(null);
      onClose();
    }
  }

  return (
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
      <ModalContent bg='alternatePurple.100'>

        {selectedTrack ? (
          <TrackModal selectedTrack={selectedTrack} />
        ) : (
          <PlaylistTracksModal setSelectedTrack={setSelectedTrack} playlist={selectedPlaylist} />
        )}

        <ModalFooter>
          <Button colorScheme='gray' mr={3} onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}