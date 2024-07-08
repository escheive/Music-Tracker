import { useEffect } from "react";
import MoodCharts from "@features/profile/components/MoodCharts";

import { Box, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecentlyPlayedSongs, useSpotifyUser } from "@api/spotify/spotify";



export const ProfileMoodRoute = () => {
  const navigate = useNavigate();
  const { user, userMutate, loggedOut } = useSpotifyUser();
  const { data: recentlyPlayedSongs, isLoading: recentlyPlayedSongsLoading } = useRecentlyPlayedSongs()

  useEffect(() => {
    let isMounted = true;

    if (loggedOut) {
      userMutate(null, false).then(() => {
        if (isMounted) {
          navigate('/');
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [loggedOut, userMutate, navigate])

  return (
    <>
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' marginBlock='5%'>
        {user ? (
          <>
            <Heading>{user.display_name}</Heading>
            <p>Product: {user.product}</p>
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