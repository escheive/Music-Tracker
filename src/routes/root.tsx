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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    storeAccessToken(accessToken);
    storeRefreshToken(refreshToken);

  }, [window.location.search]);

  

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
        <p>Access Token: {accessToken}</p>
        <p>Refresh Token: {refreshToken}</p>
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
}