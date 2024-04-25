import { useAuthContext } from "@/context/AuthProvider";
import { useUserContext } from "@/context/UserProvider";
import { useEffect } from "react";
import axiosInstance from "@/api";
import axios from 'axios';
import { generateRandomString } from "@/utils/helpers";

const clientId: string = import.meta.env.VITE_CLIENT_ID;
const redirectUri: string = import.meta.env.VITE_REDIRECT_URI;

export default function Root() {
  const { accessToken, storeAccessToken, refreshToken, storeRefreshToken } = useAuthContext();
  const { profileData, storeProfileData } = useUserContext();

  // Checks for tokens and stores them if not stored yet
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && !profileData) {
      const fetchProfile = async () => {
        const profileOptions = {
          method: 'get',
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + accessToken,
          },
        };
  
        const profileResponse = await axios(profileOptions);
        storeProfileData(profileResponse.data);
      }

      fetchProfile();
    }

    storeAccessToken(accessToken);
    storeRefreshToken(refreshToken);

  }, [accessToken]);


  const handleLogin = async () => {
    const state = generateRandomString(16);
    try {
      const authorizationUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&response_type=code&scope=user-read-private%20user-read-email`;
      window.location.href = authorizationUrl;
    } catch (error) {
      console.error('Error initiating login', error);
    }
  }


  return (
    <>
      <div>
        <h1>Music Tracker</h1>
        {profileData ? (
          <>
            <h1>{profileData.display_name}</h1>
            <p>Email: {profileData.email}</p>
            <p>Country: {profileData.country}</p>
            <p>Product: {profileData.product}</p>
            <p>Type: {profileData.type}</p>
            <p>Followers: {profileData.followers.total}</p>
            <a href={profileData.external_urls.spotify} target="blank">Open on Spotify</a>
          </>
        ) : null}
        {!accessToken ? (
          <button onClick={handleLogin}>Login</button>
        ) : (
          null
        )}
        
      </div>
    </>
  );
}