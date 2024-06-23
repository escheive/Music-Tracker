import { Box, Button, Heading, useDisclosure } from "@chakra-ui/react";
import { useSpotifyPlaylistsTracks, useSpotifyUsersPlaylists } from "@/api/spotify";
import { Link } from "react-router-dom";
import { PlaylistTracks } from "../components/PlaylistTracks";
import { useState } from "react";

export const Music = () => {
  const { data: usersPlaylists, isLoading: usersPlaylistsLoading, error: usersPlaylistsError, mutate: usersPlaylistsMutate } = useSpotifyUsersPlaylists();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  // const { data: playlistTracks } = useSpotifyPlaylistsTracks(selectedPlaylist);
  // console.log(playlistTracks)

  const handleOpenPlaylist = (playlist: string) => {
    setSelectedPlaylist(playlist);
    onOpen();
  }

  return (
    <Box>
      <Heading>Music</Heading>
      {!usersPlaylistsLoading ? (
        <>
        {usersPlaylists.items.map((playlist) => (
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