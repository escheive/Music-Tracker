import React, { createContext, useContext, useState } from 'react';

type UserContextType = {
  profileData: {} | null;
  storeProfileData: (profileData: {}) => void;
};


const UserContext = createContext<UserContextType>({
  profileData: null,
  storeProfileData: (profileData: any) => {},
});

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('usePlayerContext must be used within the PlayerContext provider');
  }
  return context;
};

const UserContextProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);

  const storeProfileData = (profileData) => {
    setProfileData(profileData);
  };

  return (
    <UserContext.Provider value={{ profileData, storeProfileData }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContextProvider, UserContext };
