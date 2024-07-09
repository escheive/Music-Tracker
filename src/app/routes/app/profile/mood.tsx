import { useEffect } from "react";
import MoodCharts from "@features/profile/components/MoodCharts";

import { Box, Heading, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecentlyPlayedSongs, useSpotifyUser } from "@api/spotify/spotify";
import spotifyLogo from '@assets/spotify/logos/Spotify_Logo_RGB_Black.png';



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
            <Heading>Your mood based on your recent songs</Heading>
            <Image 
              src={spotifyLogo} 
              objectFit='contain'
              height='30px'
              fallbackSrc='https://via.placeholder.com/150' 
            />
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