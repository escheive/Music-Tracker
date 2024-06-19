import { useAuthContext } from "@/providers/AuthProvider";
import { useUserContext } from "@/providers/UserProvider";
import { useEffect, useState } from "react";
import PopularityChart from "@/components/chart/PopularityChart";
import RadarChart from "@/components/chart/RadarChart";
import LineChart from "@/components/chart/LineChart";
import MoodCharts from "../components/MoodCharts";
import useSWR from 'swr';

import useSpotifyAPI, { useSpotifyRecentlyPlayed, useSpotifyUser } from "@/api/spotify";
import { TopItemsList } from "@/components/list/TopItemsList";
import { RecentlyPlayedList } from "@/components/list/RecentlyPlayedList";

import { Box, Button, Heading, Text, Grid, GridItem, Link } from "@chakra-ui/react";
import { fetchWithToken } from "@/features/auth/api/spotify";
import { fetchRecentlyPlayedSongs } from "@/api/spotify";
import { useNavigate } from "react-router-dom";

const fetchAndCombineRecentlyPlayedSongs = async (spotify) => {
  const recentlyPlayed = await spotify.getUsersRecentlyPlayed();
  const recentlyPlayedTrackIds = recentlyPlayed.items.map(track => track.track.id);
  const recentlyPlayedAudioFeatures = await spotify.fetchAudioFeatures(recentlyPlayedTrackIds);

  const combinedData = recentlyPlayed.items.map(track => {
    const features = recentlyPlayedAudioFeatures.audio_features.find(feature => feature.id === track.track.id);
    return { played_at: track.played_at, ...track.track, ...features };
  });

  return combinedData;
}

export const Profile = () => {
  const { accessToken, storeAccessToken, refreshToken, storeRefreshToken } = useAuthContext();
  const navigate = useNavigate();
  const { profileData, storeProfileData, topItems, storeTopItems,  storeRecentlyPlayed } = useUserContext();
  const spotify = useSpotifyAPI();
  const [additionalItems, setAdditionalItems] = useState(null);
  const [showTopItems, setShowTopItems] = useState(true);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(true);
  const [popularityNumbers, setPopularityNumbers] = useState([]);
  const [fetchedUserProfile, setFetchedUserProfile] = useState();
  const { user, userMutate, loggedOut } = useSpotifyUser();
  const { recentlyPlayed } = useSpotifyRecentlyPlayed();
  const { recentlyPlayedSongs } = fetchRecentlyPlayedSongs()
  console.log(recentlyPlayedSongs)

  useEffect(() => {
    if (loggedOut) {
      userMutate(null, false).then(() => navigate('/'))
    }
  }, [loggedOut, userMutate])

  const loadMoreItems = async () => {
    const moreTopItems = await spotify.fetchMoreTopItems();
    setAdditionalItems(moreTopItems)
  }

  // Checks for tokens and stores them if not stored yet
  // useEffect(() => {
  //   const fetchProfileData = async () => {
  //     try {
  //       const fetchedProfile = await spotify.getProfile();
  //       storeProfileData(fetchedProfile);

  //       // const fetchedRecentlyPlayed = await spotify.getUsersRecentlyPlayed();
  //       const fetchedRecentlyPlayed = await fetchAndCombineRecentlyPlayedSongs(spotify);
  //       storeRecentlyPlayed(fetchedRecentlyPlayed);

  //       const numbers = await fetchedRecentlyPlayed.map(item => item.popularity);
  //       setPopularityNumbers(numbers);

  //       const fetchedTopItems = await spotify.getUsersTopItems();
  //       storeTopItems(fetchedTopItems);

  //     } catch (error) {
  //       console.error('Error fetching profile data: ', error);
  //     }    
  //   };

  //   fetchProfileData();
  // }, []);
  // useEffect(() => {
  //   if (!accessToken) {
  //     const params = new URLSearchParams(window.location.search);
  //     const accessTokenFromParams = params.get('access_token');
  //     const refreshTokenFromParams = params.get('refresh_token');

  //     if (accessTokenFromParams) {
  //       storeAccessToken(accessTokenFromParams)
  //     }
  //     if (refreshTokenFromParams) {
  //       storeRefreshToken(refreshTokenFromParams);
  //     }
  //   } else {
  //     if (!profileData) {
  //       const fetchProfileData = async () => {
  //         try {
  //           const fetchedProfile = await spotify.getProfile();
  //           storeProfileData(fetchedProfile);

  //           // const fetchedRecentlyPlayed = await spotify.getUsersRecentlyPlayed();
  //           const fetchedRecentlyPlayed = await fetchAndCombineRecentlyPlayedSongs(spotify);
  //           storeRecentlyPlayed(fetchedRecentlyPlayed);

  //           const numbers = await fetchedRecentlyPlayed.map(item => item.popularity);
  //           setPopularityNumbers(numbers);

  //           const fetchedTopItems = await spotify.getUsersTopItems();
  //           storeTopItems(fetchedTopItems);

  //         } catch (error) {
  //           console.error('Error fetching profile data: ', error);
  //         }    
  //       };
  
  //       fetchProfileData();
  //     }
  //   }
    
  // }, [accessToken]);

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
 
        <Link onClick={handleShowRecentlyPlayed}>{showRecentlyPlayed ? 'Hide' : 'Show'} Recently Played</Link>

          {recentlyPlayedSongs.length > 1 ? (
            <>
              <LineChart 
                title='Popularity' 
                description='Popularity of your 50 most recently played tracks. Based on number of listens and how recent they were.'
                data={popularityNumbers} 
              />
              <MoodCharts
                recentlyPlayedSongs={recentlyPlayedSongs} 
              />
              
              {showRecentlyPlayed ? (
                <>
                  <Heading>Recently Played Tracks</Heading>
                  <RecentlyPlayedList recentlyPlayedSongs={recentlyPlayedSongs} />
                </>
              ) : null}
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