import { createContext, useContext } from 'react';
import { useRecentlyPlayedSongs, useUsersTopItems, useSpotifyUser } from "@/api/spotify";

type ProfileContextType = {
  user: UserProps | null,
  userMutate: any,
  loggedOut: any,
  recentlyPlayedSongs: any,
  recentlyPlayedSongsIsLoading: any,
  recentlyPlayedSongsError: any,
  topItems: any,
  topItemsLoading: any,
  topItemsError: any,
  popularityNumbers: any,
};

interface UserProps {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {};
  external_urls: {
    spotify: string
  };
  followers: {
    total: string
  };
  href: string;
  id: string;
  images: [
    {
      url: string
    }
  ];
  product: string;
  type: string;
  uri: string;
}

type ProfileProviderProps = {
  children: React.ReactNode;
};

const ProfileContext = createContext<ProfileContextType>({
  user: null,
  userMutate: null,
  loggedOut: null,
  recentlyPlayedSongs: null,
  recentlyPlayedSongsIsLoading: null,
  recentlyPlayedSongsError: null,
  topItems: null,
  topItemsLoading: null,
  topItemsError: null,
  popularityNumbers: null,
});

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within the PlayerContext provider');
  }
  return context;
};

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  const { user, userMutate, loggedOut } = useSpotifyUser();

  const { data: recentlyPlayedSongs, error: recentlyPlayedSongsError, isLoading: recentlyPlayedSongsIsLoading } = useRecentlyPlayedSongs();
  const { data: topItems, error: topItemsError, isLoading: topItemsLoading } = useUsersTopItems();

  let popularityNumbers = [];
  if (!recentlyPlayedSongsIsLoading) {
    popularityNumbers = recentlyPlayedSongs.map((item: any) => item.popularity);
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
