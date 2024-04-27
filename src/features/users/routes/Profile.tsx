import { useAuthContext } from "@/context/AuthProvider";
import { useUserContext } from "@/context/UserProvider";
import { useEffect } from "react";
import useSpotifyAPI from "@/api/spotify";
import { TopItemsList } from "@/components/list/TopItemsList";

import { Box, Button, Heading, Text } from "@chakra-ui/react";

export const Profile = () => {
  const { accessToken, storeAccessToken, refreshToken, storeRefreshToken } = useAuthContext();
  const { profileData, storeProfileData, topItems, storeTopItems } = useUserContext();
  const spotify = useSpotifyAPI(accessToken, refreshToken);

  // Checks for tokens and stores them if not stored yet
  useEffect(() => {
    if (!accessToken) {
      const params = new URLSearchParams(window.location.search);
      const accessTokenFromParams = params.get('access_token');
      const refreshTokenFromParams = params.get('refresh_token');

      if (accessTokenFromParams) {
        storeAccessToken(accessTokenFromParams)
      }
      if (refreshTokenFromParams) {
        storeRefreshToken(refreshTokenFromParams);
      }
    } else {
      if (!profileData) {
        const fetchProfileData = async () => {
          try {
            const profile = await spotify.getProfile();
            storeProfileData(profile);
            const topItems = await spotify.getUsersTopItems();
            storeTopItems(topItems);
          } catch (error) {
            console.error('Error fetching profile data: ', error);
          }    
        };
  
        fetchProfileData();
      }
    }
    
  }, [spotify, accessToken]);

  console.log(topItems)

  return (
    <>
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
        <Heading>Music Tracker</Heading>
        {profileData ? (
          <>
            <Heading>{profileData.display_name}</Heading>
            <p>Email: {profileData.email}</p>
            <p>Country: {profileData.country}</p>
            <p>Product: {profileData.product}</p>
            <p>Type: {profileData.type}</p>
            <p>Followers: {profileData.followers.total}</p>
            <a href={profileData.external_urls.spotify} target="blank">Open on Spotify</a>
          </>
        ) : null}
        {topItems ? (
          <>
          <TopItemsList itemType='Artists' items={topItems.artists.items} />
          {topItems.artists.items.map((artist) => (
            <p>{artist.name}</p>
          ))}
          {topItems.tracks.items.map((track) => (
            <p>{track.name}</p>
          ))}
          </>
        ) : null}
        
      </Box>
    </>
  );
};