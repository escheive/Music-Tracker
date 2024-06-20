import { useAuthContext } from "@/providers/AuthProvider";
import { useUserContext } from "@/providers/UserProvider";
import { useEffect, useState } from "react";
import PopularityChart from "@/components/chart/PopularityChart";
import RadarChart from "@/components/chart/RadarChart";
import LineChart from "@/components/chart/LineChart";
import MoodCharts from "../components/MoodCharts";
import useSWR from 'swr';

import useSpotifyAPI, { useRecentlyPlayedSongs, useUsersTopItems, useSpotifyUser } from "@/api/spotify";
import { TopItemsList } from "@/components/list/TopItemsList";
import { RecentlyPlayedList } from "@/components/list/RecentlyPlayedList";

import { Box, Button, Heading, Text, Grid, GridItem, Link, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";



export const Profile = () => {

  const navigate = useNavigate();

  const spotify = useSpotifyAPI();
  const [additionalItems, setAdditionalItems] = useState(null);
  const [showTopItems, setShowTopItems] = useState(true);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(true);
  let popularityNumbers = [];
  const { user, userMutate, loggedOut } = useSpotifyUser();
  const { recentlyPlayedSongs, recentlyPlayedSongsIsLoading, recentlyPlayedSongsError } = useRecentlyPlayedSongs();
  const { data: topItems, isLoading: topItemsLoading, error: topItemsError} = useUsersTopItems();

  if (recentlyPlayedSongsError) return <div>Error loading data</div>;
  if (!recentlyPlayedSongsIsLoading) {
    popularityNumbers = recentlyPlayedSongs.map(item => item.popularity)
  }

  useEffect(() => {
    if (loggedOut) {
      userMutate(null, false).then(() => navigate('/'))
    }
  }, [loggedOut, userMutate])

  const loadMoreItems = async () => {
    const moreTopItems = await spotify.fetchMoreTopItems();
    setAdditionalItems(moreTopItems)
  }


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

        {!recentlyPlayedSongsIsLoading ? (
          <>
            <LineChart 
              title='Popularity' 
              description='Popularity of your 50 most recently played tracks. Based on number of listens and how recent they were.'
              data={popularityNumbers} 
            />
            <MoodCharts
              recentlyPlayedSongs={recentlyPlayedSongs} 
            />

            <Link onClick={handleShowRecentlyPlayed}>{showRecentlyPlayed ? 'Hide' : 'Show'} Recently Played</Link>
            
            {showRecentlyPlayed ? (
              <>
                <Heading>Recently Played Tracks</Heading>
                <RecentlyPlayedList recentlyPlayedSongs={recentlyPlayedSongs} />
              </>
            ) : null}
          </>
        ) : null}

        <Link onClick={handleShowTopItems}>{showTopItems ? 'Hide' : 'Show'} Top Items</Link>

        {!topItemsLoading && showTopItems ? (
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