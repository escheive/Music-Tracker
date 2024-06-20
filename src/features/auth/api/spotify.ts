const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI

const generateRandomString = (length: number) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain: any) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: any) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function fetchJSON(input: any, init: any) {
  const response = await fetch(input, init)
  const body = await response.json()
  if (!response.ok) {
    throw new ErrorResponse(response, body)
  }
  return body
}

class ErrorResponse extends Error {
  status: any;
  body: any;
  constructor(response: any, body: any) {
    super(response.statusText)
    this.status = response.status
    this.body = body
  }
}

export const beginLogin = async () => {
  const codeVerifier  = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  const state = generateRandomString(16);

  const scope = 'user-read-private user-read-email playlist-read-private user-follow-read user-top-read user-read-recently-played user-library-read user-read-currently-playing user-read-playback-state user-read-playback-position';

  window.localStorage.setItem('code_verifier', codeVerifier);
  window.localStorage.setItem('state', state);
  
  const params =  new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function completeLogin() {
  const state = localStorage.getItem('state');
  const codeVerifier = localStorage.getItem('code_verifier');

  const params = new URLSearchParams(location.search);
  let code = params.get('code');
  const errorParam = params.get('error');


  if (errorParam !== null) {
    throw new Error(errorParam)
  } else if (!params.has('state')) {
    throw new Error('State missing from response')
  } else if (params.get('state') !== state) {
    throw new Error('State mismatch')
  } else if (!params.has('code')) {
    throw new Error('Code missing from response')
  }

  await createAccessToken({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  })
}

export const logout = () => {
  window.localStorage.removeItem('tokenSet')
}

export const fetchWithToken = async (input: any) => {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    throw new ErrorResponse(new Response(undefined, { status: 401 }), {})
  }

  return fetchJSON(input, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

const createAccessToken = async (params: any) => {
  const response = await fetchJSON('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
  })

  const accessToken = response.access_token
  const expires_at = Date.now() + 1000 * response.expires_in

  localStorage.setItem('tokenSet', JSON.stringify({ ...response, expires_at }))

  return accessToken
}

const getAccessToken = async () => {
  let tokenSetString = localStorage.getItem('tokenSet');
  let tokenSet;

  if (tokenSetString !== null) {
    tokenSet = JSON.parse(tokenSetString);
  } else {
    return
  }

  if (tokenSet.expires_at < Date.now()) {
    tokenSet = await createAccessToken({
      grant_type: 'refresh_token',
      refresh_token: tokenSet.refresh_token,
    })
  }

  return tokenSet.access_token
}