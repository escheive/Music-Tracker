import { useAuthContext } from "@/context/AuthProvider";
import { useEffect } from "react";
import axiosInstance from "@/api";
import axios from 'axios';
import { generateRandomString } from "@/utils/helpers";

const clientId: string = import.meta.env.VITE_CLIENT_ID;
const redirectUri: string = import.meta.env.VITE_REDIRECT_URI;

export default function Root() {
  const { accessToken, storeAccessToken } = useAuthContext();

  

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
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  );
}