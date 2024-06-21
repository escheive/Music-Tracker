import { useProfileContext } from "@/providers/ProfileProvider";
import { useEffect } from "react";
import MoodCharts from "../components/MoodCharts";

import { Box, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecentlyPlayedSongs, useSpotifyUser } from "@/api/spotify";



export const Mood = () => {
  const navigate = useNavigate();
  const { user, userMutate, loggedOut } = useSpotifyUser();
  const { data: recentlyPlayedSongs, isLoading: recentlyPlayedSongsLoading } = useRecentlyPlayedSongs()

  useEffect(() => {
    if (loggedOut) {
      userMutate(null, false).then(() => navigate('/'))
    }
  }, [loggedOut, userMutate])

  return (
    <>
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        <Heading>Music Tracker</Heading>
        {user ? (
          <>
            <Heading>{user.display_name}</Heading>
            <p>Email: {user.email}</p>
            <p>Country: {user.country}</p>
            <p>Product: {user.product}</p>
            <p>Type: {user.type}</p>
            <p>Followers: {user.followers.total}</p>
            <a href={user.external_urls.spotify} target="blank">Open on Spotify</a>
          </>
        ) : null}

        {!recentlyPlayedSongsLoading ? (
          <>
            <MoodCharts
              recentlyPlayedSongs={recentlyPlayedSongs} 
            />
          </>
        ) : null}

      </Box>
    </>
  );
};