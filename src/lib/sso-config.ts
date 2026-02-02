/**
 * ZestAcademy SSO Configuration
 * OAuth 2.0 Authorization Code Flow
 */

export const ssoConfig = {
  authServerUrl: process.env.NEXT_PUBLIC_SSO_AUTH_URL || 'https://auth.zestacademy.tech',
  clientId: process.env.NEXT_PUBLIC_SSO_CLIENT_ID || 'zestfolio',
  redirectUri: process.env.NEXT_PUBLIC_SSO_REDIRECT_URI || 'https://zestfolio.tech/api/auth/callback',
  clientSecret: process.env.SSO_CLIENT_SECRET || '',
  
  // OAuth endpoints
  authorizeEndpoint: '/authorize',
  tokenEndpoint: '/token',
  userInfoEndpoint: '/userinfo',
  logoutEndpoint: '/logout',
  
  // Default scopes
  scopes: ['openid', 'profile', 'email'],
  
  // Response type for authorization code flow
  responseType: 'code',
};

/**
 * Generate authorization URL with CSRF protection
 */
export function getAuthorizationUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: ssoConfig.clientId,
    redirect_uri: ssoConfig.redirectUri,
    response_type: ssoConfig.responseType,
    scope: ssoConfig.scopes.join(' '),
    state,
  });

  return `${ssoConfig.authServerUrl}${ssoConfig.authorizeEndpoint}?${params.toString()}`;
}

/**
 * Generate logout URL
 */
export function getLogoutUrl(postLogoutRedirectUri?: string): string {
  const params = new URLSearchParams({
    client_id: ssoConfig.clientId,
  });
  
  if (postLogoutRedirectUri) {
    params.append('post_logout_redirect_uri', postLogoutRedirectUri);
  }

  return `${ssoConfig.authServerUrl}${ssoConfig.logoutEndpoint}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}> {
  const response = await fetch(`${ssoConfig.authServerUrl}${ssoConfig.tokenEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: ssoConfig.redirectUri,
      client_id: ssoConfig.clientId,
      client_secret: ssoConfig.clientSecret,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return response.json();
}

/**
 * Get user info from access token
 */
export async function getUserInfo(accessToken: string): Promise<{
  sub: string;
  email: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
}> {
  const response = await fetch(`${ssoConfig.authServerUrl}${ssoConfig.userInfoEndpoint}`, {
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

/**
 * Generate a random state parameter for CSRF protection
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Server-side fallback
    const crypto = require('crypto');
    crypto.randomFillSync(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
