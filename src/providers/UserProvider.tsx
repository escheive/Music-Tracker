import React, { createContext, useContext, useState } from 'react';

type UserContextType = {
  profileData: {} | null;
  storeProfileData: (profileData: {}) => void;
  topItems: {} | null;
  storeTopItems: (topItems: {}) => void;
  recentlyPlayed: {} | null;
  storeRecentlyPlayed: (recentlyPlayed: {}) => void;
};


const UserContext = createContext<UserContextType>({
  profileData: null,
  storeProfileData: (profileData: any) => {},
  topItems: null,
  storeTopItems: (topItems: any) => {},
  recentlyPlayed: null,
  storeRecentlyPlayed: (recentlyPlayed: any) => {},
});

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within the PlayerContext provider');
  }
  return context;
};

const UserContextProvider = ({ children }: any) => {
  const [profileData, setProfileData] = useState(null);
  const [topItems, setTopItems] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);

  const storeProfileData = (profileData: any) => {
    setProfileData(profileData);
  };

  const storeTopItems = (topItems: any) => {
    setTopItems(topItems);
  };

  const storeRecentlyPlayed =(recentlyPlayed: any) => {
    setRecentlyPlayed(recentlyPlayed);
  };

  return (
    <UserContext.Provider value={{ 
      profileData, 
      storeProfileData,
      topItems,
      storeTopItems,
      recentlyPlayed,
      storeRecentlyPlayed,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider, UserContext };
