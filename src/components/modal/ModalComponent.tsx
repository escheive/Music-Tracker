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


export const ModalComponent = () => {
  const { selectedTrack, setSelectedTrack, selectedPlaylist, setSelectedPlaylist, isOpen, onClose } = useModalContext();

  const handleClose = () => {

    if (selectedTrack) {
      setSelectedTrack(null);
    } else {
      setSelectedPlaylist(null);
    }

    onClose();
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
        
        <ModalCloseButton />
        <ModalBody marginTop={5}>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='gray' mr={3} onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}