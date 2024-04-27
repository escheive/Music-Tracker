import { useAuthContext } from "@/providers/AuthProvider";
import { useUserContext } from "@/providers/UserProvider";
import { useEffect, useState } from "react";
import useSpotifyAPI from "@/api/spotify";
import { TopItemsList } from "@/components/list/TopItemsList";

import { Box, Button, Heading, Text, Grid, GridItem, Link } from "@chakra-ui/react";

export const Profile = () => {
  const { accessToken, storeAccessToken, refreshToken, storeRefreshToken } = useAuthContext();
  const { profileData, storeProfileData, topItems, storeTopItems } = useUserContext();
  const spotify = useSpotifyAPI();
  const [additionalItems, setAdditionalItems] = useState(null);

  const loadMoreItems = async () => {
    const moreTopItems = await spotify.fetchMoreTopItems();
    setAdditionalItems(moreTopItems)
  }

  console.log(profileData)

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
            <Grid templateColumns='repeat(2, 1fr)' gap={6} p={6} w='100%'>
              <GridItem w='100%' noOfLines={1}>
                <TopItemsList itemType='Artists' items={topItems.artists.items} additionalItems={additionalItems?.artists.items} />
              </GridItem>
              <GridItem w='100%' noOfLines={1}>
                <TopItemsList itemType='Tracks' items={topItems.tracks.items} additionalItems={additionalItems?.tracks.items} />
              </GridItem>
            </Grid>
            {!additionalItems ? (
              <Link onClick={loadMoreItems} m={8}>Load More</Link>
            ) : null}
          </>
        ) : null}
        
      </Box>
    </>
  );
};