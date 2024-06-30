import { useEffect, useState } from "react";
import LineChart from "@/components/chart/LineChart";

import { TopItemsList } from "@/components/list/TopItemsList";
import { RecentlyPlayedList } from "@/components/list/RecentlyPlayedList";

import { Box, Heading, Grid, GridItem, Link, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecentlyPlayedSongs, useSpotifyUser, useUsersTopItems } from "@api/spotify/spotify";
import { useAuthContext } from "@context/AuthProvider";
import { useSupabaseUser } from "@api/supabase/fetch";
import spotifyCMYKLogo from '@assets/spotify/logos/Spotify_Logo_CMYK_Green.png';
import { ExternalLinkIcon } from "@chakra-ui/icons";



export const ProfileRoute = () => {
  const navigate = useNavigate();
  const { user, userMutate, loggedOut } = useSpotifyUser();
  const { data: recentlyPlayedSongs, isLoading: recentlyPlayedSongsLoading, error: recentlyPlayedSongsError } = useRecentlyPlayedSongs();
  const { data: topItems, isLoading: topItemsLoading } = useUsersTopItems();
  const [showTopItems, setShowTopItems] = useState(true);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(true);
  const { session } = useAuthContext();
  const { data: profile, error: profileError } = useSupabaseUser(session?.user.id);

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
    console.error(recentlyPlayedSongsError)
    console.log(recentlyPlayedSongsError.status)
    console.log(recentlyPlayedSongsError.body)
    return (
      <Heading>Error</Heading>
    )
  }

  // Derive popularity numbers from recently played songs
  const popularityNumbers = recentlyPlayedSongs ? recentlyPlayedSongs.map((song: any) => song.popularity) : [];

  return (
    <>
      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' marginBlock='5%'>
        <Box alignItems='flex-start' width='100%' padding={3}>
          <Text fontSize='3xl'>{profile?.username}</Text>
            <Link href={user.external_urls.spotify} target="_blank" isExternal _hover={{ fontStyle: 'normal'}}>
              <Flex alignItems='center'>
                <Image
                  src={spotifyCMYKLogo} 
                  width={['80px']}
                  height={['24px']}
                  fallbackSrc='https://via.placeholder.com/150' 
                />
                <Text fontSize={['md', 'lg']}>{user.display_name}</Text>
                <ExternalLinkIcon mx='2px' />
              </Flex>
            </Link>
            <Text>Email: {user.email}</Text>
            <Text>Country: {user.country}</Text>
            <Text>Product: {user.product}</Text>
            <Text>Type: {user.type}</Text>
            <Text>Followers: {user.followers.total}</Text>
            <a href={user.external_urls.spotify} target="blank">Open on Spotify</a>
        </Box>


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