/**
 * Google OAuth 2.0 Server-side Implementation
 * Only to be imported in API routes (server-side)
 */

const googleOAuthServerConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userInfoEndpoint: 'https://www.googleapis.com/oauth2/v2/userinfo',
};

/**
 * Exchange authorization code for tokens
 * Manual implementation without google-auth-library to avoid build issues
 */
export async function exchangeGoogleCodeForTokens(code: string) {
  const params = new URLSearchParams({
    code,
    client_id: googleOAuthServerConfig.clientId,
    client_secret: googleOAuthServerConfig.clientSecret,
    redirect_uri: googleOAuthServerConfig.redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(googleOAuthServerConfig.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

/**
 * Get user info from Google
 */
export async function getGoogleUserInfo(accessToken: string) {
  const response = await fetch(googleOAuthServerConfig.userInfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch user info: ${error}`);
  }

  return response.json();
}
