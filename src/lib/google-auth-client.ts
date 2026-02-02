/**
 * Google OAuth 2.0 Configuration - Client Side
 * Safe to import in browser components
 */

export const googleOAuthClientConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback',
  authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  scopes: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
};

/**
 * Generate authorization URL for Google OAuth
 */
export function getGoogleAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: googleOAuthClientConfig.clientId,
    redirect_uri: googleOAuthClientConfig.redirectUri,
    response_type: 'code',
    scope: googleOAuthClientConfig.scopes.join(' '),
    state,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `${googleOAuthClientConfig.authEndpoint}?${params.toString()}`;
}
