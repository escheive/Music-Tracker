import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import { useSpotifyUsersPlaylists } from "@/api/spotify";
import { PlaylistTracks } from "../components/PlaylistTracks";
import { useState } from "react";

export const Music = () => {
  const { data: usersPlaylists, isLoading: usersPlaylistsLoading, error: usersPlaylistsError } = useSpotifyUsersPlaylists();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState(usersPlaylists.items[0]);

  const handleOpenPlaylist = (playlist: any) => {
    setSelectedPlaylist(playlist);
    onOpen();
  }

  console.log(usersPlaylistsLoading, usersPlaylistsLoading)

  return (
    <Box>
      <Heading>Music</Heading>
      {!usersPlaylistsLoading && usersPlaylists ? (
        <>
        {usersPlaylists.items.map((playlist: any) => (
          <Box key={playlist.id}>
            <Button onClick={() => handleOpenPlaylist(playlist)} variant='link'>
              <Heading key={playlist.id}>{playlist.name}</Heading>
            </Button>
          </Box>
        ))}

          <PlaylistTracks isOpen={isOpen} onClose={onClose} playlist={selectedPlaylist} />
        </>
      ) : null}
    </Box>
  )
}