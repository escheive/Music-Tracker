import { useAuthContext } from "@/providers/AuthProvider";
import { useUserContext } from "@/providers/UserProvider";
import { useEffect, useState } from "react";
import PopularityChart from "@/components/chart/PopularityChart";
import MoodChart from "@/components/chart/MoodChart";

import useSpotifyAPI from "@/api/spotify";
import { TopItemsList } from "@/components/list/TopItemsList";
import { RecentlyPlayedList } from "@/components/list/RecentlyPlayedList";

import { Box, Button, Heading, Text, Grid, GridItem, Link } from "@chakra-ui/react";

const mood = [
  { Happiness: 80, Sadness: 30, Energetic: 60, Calm: 20 },
  { Happiness: 70, Sadness: 40, Energetic: 50, Calm: 100 },
  { Happiness: 50, Sadness: 10, Energetic: 90, Calm: 10 },
]

const moodCategories = ['Happiness', 'Energetic', 'Sadness', 'Calm']

export const Profile = () => {
  const { accessToken, storeAccessToken, refreshToken, storeRefreshToken } = useAuthContext();
  const { profileData, storeProfileData, topItems, storeTopItems, recentlyPlayed, storeRecentlyPlayed } = useUserContext();
  const spotify = useSpotifyAPI();
  const [additionalItems, setAdditionalItems] = useState(null);
  const [showTopItems, setShowTopItems] = useState(true);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(true);
  const [popularityNumbers, setPopularityNumbers] = useState([]);

  const loadMoreItems = async () => {
    const moreTopItems = await spotify.fetchMoreTopItems();
    setAdditionalItems(moreTopItems)
  }

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
            const fetchedProfile = await spotify.getProfile();
            storeProfileData(fetchedProfile);
            const fetchedRecentlyPlayed = await spotify.getUsersRecentlyPlayed();
            storeRecentlyPlayed(fetchedRecentlyPlayed);
            const numbers = await fetchedRecentlyPlayed.items.map(item => item.track.popularity);
            setPopularityNumbers(numbers);
            const fetchedTopItems = await spotify.getUsersTopItems();
            storeTopItems(fetchedTopItems);
          } catch (error) {
            console.error('Error fetching profile data: ', error);
          }    
        };
  
        fetchProfileData();
      }
    }
    
  }, [accessToken]);

  const handleShowTopItems = () => {
    setShowTopItems(!showTopItems);
  };

  const handleShowRecentlyPlayed = () => {
    setShowRecentlyPlayed(!showRecentlyPlayed);
  };

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

        <PopularityChart title='Popularity' data={popularityNumbers} />
        <MoodChart data={mood} categories={moodCategories} />
 
        <Link onClick={handleShowRecentlyPlayed}>{showRecentlyPlayed ? 'Hide' : 'Show'} Recently Played</Link>

        {recentlyPlayed && showRecentlyPlayed ? (
          <>
            <Heading>Recently Played Tracks</Heading>
            <RecentlyPlayedList recentlyPlayed={recentlyPlayed.items} />
          </>
        ) : null}

        <Link onClick={handleShowTopItems}>{showTopItems ? 'Hide' : 'Show'} Top Items</Link>

        {topItems && showTopItems ? (
          <>
            <Heading>Top Artists And Tracks</Heading>
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