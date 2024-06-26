import { Box, Button, Heading, useDisclosure, Image, Text } from "@chakra-ui/react";
import { useSpotifyUsersPlaylists } from "@/api/spotify";
import { PlaylistTracks } from "../components/PlaylistTracks";
import { useState } from "react";

export const Music = () => {
  const { data: usersPlaylists, isLoading: usersPlaylistsLoading, error: usersPlaylistsError } = useSpotifyUsersPlaylists();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState(usersPlaylists?.items[0]);

  const handleOpenPlaylist = (playlist: any) => {
    setSelectedPlaylist(playlist);
    onOpen();
  }

  if (usersPlaylistsError) {
    return (
      <Heading>Error: {usersPlaylistsError}</Heading>
    )
  }

  return (
    <Box marginInline='2%' marginBlock='5%' >
      {!usersPlaylistsLoading && usersPlaylists ? (
        <>
        {usersPlaylists.items.map((playlist: any) => (
          <Box key={playlist.id} padding={1}>
            <Button onClick={() => handleOpenPlaylist(playlist)} variant='link'>
            <Image 
                src={playlist.images[0].url} 
                boxSize={{base: '40px', md: '60px'}} 
                fallbackSrc='https://via.placeholder.com/150' 
                paddingRight={1}
              />
              <Text key={playlist.id} fontSize='3xl'>{playlist.name}</Text>
            </Button>
          </Box>
        ))}

          <PlaylistTracks isOpen={isOpen} onClose={onClose} playlist={selectedPlaylist} />
        </>
      ) : null}
    </Box>
  )
}