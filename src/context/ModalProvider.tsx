import { useDisclosure } from '@chakra-ui/react';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

type ModalContextType = {
  selectedTrack: Record<string, any> | null;
  setSelectedTrack: Dispatch<SetStateAction<Record<string, any> | null>>;
  selectedPlaylist: Record<string, any> | null;
  setSelectedPlaylist: Dispatch<SetStateAction<Record<string, any> | null>>;
  isOpen: any,
  onOpen: any,
  onClose: any,
};

type ModalProviderProps = {
  children: React.ReactNode;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [selectedTrack, setSelectedTrack] = useState<Record<string, any> | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Record<string, any> | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ModalContext.Provider
      value={{
        selectedTrack,
        setSelectedTrack,
        selectedPlaylist,
        setSelectedPlaylist,
        isOpen,
        onOpen,
        onClose
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within the ModalContext provider');
  }
  return context;
};