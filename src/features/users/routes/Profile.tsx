import { useEffect, useState } from "react";
import LineChart from "@/components/chart/LineChart";

import { TopItemsList } from "@/components/list/TopItemsList";
import { RecentlyPlayedList } from "@/components/list/RecentlyPlayedList";

import { Box, Heading, Grid, GridItem, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecentlyPlayedSongs, useSpotifyUser, useUsersTopItems } from "@/api/spotify";



export const Profile = () => {
  const navigate = useNavigate();
  const { user, userMutate, loggedOut } = useSpotifyUser();
  const { data: recentlyPlayedSongs, isLoading: recentlyPlayedSongsLoading, error: recentlyPlayedSongsError } = useRecentlyPlayedSongs();
  const { data: topItems, isLoading: topItemsLoading } = useUsersTopItems();
  const [showTopItems, setShowTopItems] = useState(true);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(true);

  useEffect(() => {
    if (loggedOut) {
      userMutate(null, false).then(() => navigate('/'));
    }
  }, [loggedOut, userMutate]);

  const handleShowTopItems = () => {
    setShowTopItems(!showTopItems);
  };

  const handleShowRecentlyPlayed = () => {
    setShowRecentlyPlayed(!showRecentlyPlayed);
  };

  if (!user) {
    return (
      <Heading>Please connect your Spotify to see your profile</Heading>
    )
  }

  if (recentlyPlayedSongsError) {
    return (
      <Heading>Error: {recentlyPlayedSongsError}</Heading>
    )
  }

  // Derive popularity numbers from recently played songs
  const popularityNumbers = recentlyPlayedSongs ? recentlyPlayedSongs.map((song: any) => song.popularity) : [];

  return (
    <>
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' marginBlock='5%'>
        <Heading>Music Tracker</Heading>
        <Heading>{user.display_name}</Heading>
        <p>Email: {user.email}</p>
        <p>Country: {user.country}</p>
        <p>Product: {user.product}</p>
        <p>Type: {user.type}</p>
        <p>Followers: {user.followers.total}</p>
        <a href={user.external_urls.spotify} target="blank">Open on Spotify</a>


        {!recentlyPlayedSongsLoading ? (
          <>
            <LineChart 
              title='Popularity' 
              description='Popularity of your 50 most recently played tracks. Based on number of listens and how recent they were.'
              data={popularityNumbers} 
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
                <TopItemsList itemType='Artists' items={topItems.artists.items} />
              </GridItem>
              <GridItem w='100%' noOfLines={1}>
                <TopItemsList itemType='Tracks' items={topItems.tracks.items} />
              </GridItem>
            </Grid>
          </>
        ) : null}

      </Box>
    </>
  );
};