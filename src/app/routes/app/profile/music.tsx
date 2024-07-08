import { Box, Button, Heading, Image, Text } from "@chakra-ui/react";
import { useSpotifyUsersPlaylists } from "@api/spotify/spotify";
import { useModalContext } from "@/context/ModalProvider";

export const ProfileMusicRoute = () => {
  const { data: usersPlaylists, isLoading: usersPlaylistsLoading, error: usersPlaylistsError } = useSpotifyUsersPlaylists();
  const { onOpen, setSelectedPlaylist } = useModalContext();
  console.log(usersPlaylists)

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

        </>
      ) : null}
    </Box>
  )
}