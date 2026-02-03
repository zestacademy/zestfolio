/**
 * OAuth 2.0 with PKCE Helper
 * Implements Authorization Code Flow with PKCE for enhanced security
 */

import pkceChallenge from 'pkce-challenge';

const AUTH_SERVER_URL = process.env.NEXT_PUBLIC_SSO_AUTH_URL || 'https://auth.zestacademy.tech';
const CLIENT_ID = process.env.NEXT_PUBLIC_SSO_CLIENT_ID || 'zestfolio';
const REDIRECT_URI = process.env.NEXT_PUBLIC_SSO_REDIRECT_URI || 'https://zestfolio.zestacademy.tech/auth/callback';

/**
 * Generate PKCE challenge and redirect to authorization endpoint
 */
export async function initiateLogin() {
  // Generate PKCE challenge
  const challenge = await pkceChallenge();
  
  // Store code_verifier in sessionStorage (needed for token exchange)
  sessionStorage.setItem('pkce_code_verifier', challenge.code_verifier);
  
  // Generate random state for CSRF protection
  const state = generateRandomString(32);
  sessionStorage.setItem('oauth_state', state);
  
  // Build authorization URL
  const authUrl = new URL(`${AUTH_SERVER_URL}/api/oauth/authorize`);
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', challenge.code_challenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  
  // Redirect to auth server
  window.location.href = authUrl.toString();
}

/**
 * Generate random string for state parameter
 */
export function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
