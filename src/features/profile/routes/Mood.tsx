import { useAuthContext } from "@/providers/AuthProvider";
import { useProfileContext } from "@/providers/ProfileProvider";
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



export const Mood = () => {
  const navigate = useNavigate();
  const { 
    user,
    userMutate,
    loggedOut,
    recentlyPlayedSongs,
    recentlyPlayedSongsIsLoading,
    recentlyPlayedSongsError,
    topItems,
    topItemsLoading,
    topItemsError,
    popularityNumbers, 
  } = useProfileContext();

  useEffect(() => {
    if (loggedOut) {
      userMutate(null, false).then(() => navigate('/'))
    }
  }, [loggedOut, userMutate])

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
            <MoodCharts
              recentlyPlayedSongs={recentlyPlayedSongs} 
            />
          </>
        ) : null}

      </Box>
    </>
  );
};