import React, { createContext, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import useSpotifyAPI, { useRecentlyPlayedSongs, useUsersTopItems, useSpotifyUser } from "@/api/spotify";

// const ProfileContext = createContext();


const ProfileContext = createContext({});

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within the PlayerContext provider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const spotify = useSpotifyAPI();
  const [additionalItems, setAdditionalItems] = useState(null);
  const [showTopItems, setShowTopItems] = useState(true);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(true);
  const { user, userMutate, loggedOut } = useSpotifyUser();

  const { data: recentlyPlayedSongs, error: recentlyPlayedSongsError, isLoading: recentlyPlayedSongsIsLoading } = useRecentlyPlayedSongs();
  const { data: topItems, error: topItemsError, isLoading: topItemsLoading } = useUsersTopItems();

  let popularityNumbers = [];
  if (!recentlyPlayedSongsIsLoading) {
    popularityNumbers = recentlyPlayedSongs.map(item => item.popularity);
  }

  return (
    <ProfileContext.Provider
      value={{
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
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(ProfileContext);
};
