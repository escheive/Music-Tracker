import { useEffect, useState } from "react";
import LineChart from "@/components/chart/LineChart";

import { TopItemsList } from "@/components/list/TopItemsList";
import { RecentlyPlayedList } from "@/components/list/RecentlyPlayedList";

import { Box, Heading, Grid, GridItem, Link, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useRecentlyPlayedSongs, useSpotifyUser, useUsersTopItems } from "@api/spotify/spotify";
import { useAuthContext } from "@context/AuthProvider";
import { useSupabaseProfile } from "@api/supabase/fetch/fetch";
import spotifyCMYKLogo from '@assets/spotify/logos/Spotify_Logo_CMYK_Green.png';
import { ExternalLinkIcon } from "@chakra-ui/icons";
import spotifyLogo from '@assets/spotify/logos/Spotify_Logo_RGB_Black.png';


export const ProfileRoute = () => {
  const navigate = useNavigate();
  const { user, userMutate, loggedOut } = useSpotifyUser();
  const { data: recentlyPlayedSongs, isLoading: recentlyPlayedSongsLoading, error: recentlyPlayedSongsError } = useRecentlyPlayedSongs();
  const { data: topItems, isLoading: topItemsLoading } = useUsersTopItems();
  const [showTopItems, setShowTopItems] = useState(true);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(true);
  const { session } = useAuthContext();
  const { data: profile, error: profileError } = session ? useSupabaseProfile(session?.user.id) : { data: null, error: null }
  console.log(profileError, recentlyPlayedSongsError, recentlyPlayedSongsLoading, topItemsLoading)

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
                <Text fontSize={['md', 'lg']}>{user.display_name} on</Text>
                <Image
                  src={spotifyCMYKLogo} 
                  width={['80px']}
                  height={['24px']}
                  mx='2px'
                  fallbackSrc='https://via.placeholder.com/150' 
                />
                <ExternalLinkIcon />
              </Flex>
            </Link>
            <Text>{user.product === 'premium' ? 'Premium' : 'Free'} user</Text>
            <Text>Followers: {user.followers.total}</Text>
        </Box>

        <LineChart 
          title='Listening Popularity' 
          description='Popularity of your 50 most recently played tracks. Based on number of listens and how recent they were.'
          data={popularityNumbers} 
        />

        <Link onClick={handleShowRecentlyPlayed}>{showRecentlyPlayed ? 'Hide' : 'Show'} Recently Played</Link>
        
        {showRecentlyPlayed ? (
          <>
            <Heading>Recently Played Tracks</Heading>
            <Image 
              src={spotifyLogo} 
              objectFit='contain'
              height='30px'
              fallbackSrc='https://via.placeholder.com/150' 
            />
            <RecentlyPlayedList recentlyPlayedSongs={recentlyPlayedSongs} />
          </>
        ) : null}

        <Link onClick={handleShowTopItems}>{showTopItems ? 'Hide' : 'Show'} Top Items</Link>

          {showTopItems ? (
            <>
              <Heading>Top Artists And Tracks</Heading>
              <Image 
                src={spotifyLogo} 
                objectFit='contain'
                height='30px'
                fallbackSrc='https://via.placeholder.com/150' 
              />
              <Grid templateColumns='repeat(2, 1fr)' gap={6} p={6} w='100%'>
                <GridItem w='100%' noOfLines={1}>
                  <TopItemsList itemType='Artists' items={topItems?.artists?.items} />
                </GridItem>
                <GridItem w='100%' noOfLines={1}>
                  <TopItemsList itemType='Tracks' items={topItems?.tracks?.items} />
                </GridItem>
              </Grid>
            </>
          ) : null}

      </Box>
    </>
  );
};