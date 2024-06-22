import { Box, Heading } from "@chakra-ui/react";
import { useSpotifyUsersPlaylists } from "@/api/spotify";

export const Music = () => {
  const { data: usersPlaylists, isLoading: usersPlaylistsLoading, error: usersPlaylistsError, mutate: usersPlaylistsMutate } = useSpotifyUsersPlaylists();
  console.log(usersPlaylists)

  return (
    <Box>
      <Heading>Music</Heading>
      {!usersPlaylistsLoading ? (
        <>
        {usersPlaylists.items.map((playlists) => (
          <Heading key={playlists.id}>{playlists.name}</Heading>
        ))}
        </>
      ) : null}
    </Box>
  )
}