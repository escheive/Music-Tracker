import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useModalContext } from '@/context/ModalProvider';
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
      size='3xl'
    >
      <ModalOverlay 
        backdropInvert='80%'
        backdropBlur='2px'
      />
      <ModalContent>

        {selectedTrack ? (
          <TrackModal selectedTrack={selectedTrack} />
        ) : (
          <PlaylistTracksModal playlist={selectedPlaylist} />
        )}

        <ModalFooter>
          <Button mr={3} onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}