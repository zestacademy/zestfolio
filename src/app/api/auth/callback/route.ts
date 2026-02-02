/**
 * OAuth 2.0 Authorization Callback Handler
 * Handles the redirect from auth.zestacademy.tech with authorization code
 */

import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getUserInfo, ssoConfig } from '@/lib/sso-config';
import { validateJWT } from '@/lib/jwt-utils';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle error from auth server
    if (error) {
      console.error('Authorization error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      );
    }

    // Validate state parameter (CSRF protection)
    const cookieStore = await cookies();
    const storedState = cookieStore.get('oauth_state')?.value;
    
    if (!state || state !== storedState) {
      console.error('State mismatch - possible CSRF attack');
      return NextResponse.redirect(
        new URL('/login?error=Invalid+state+parameter', request.url)
      );
    }

    // Validate code parameter
    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=Missing+authorization+code', request.url)
      );
    }

    // Exchange code for tokens (backend-only, never expose client secret)
    const tokens = await exchangeCodeForTokens(code);

    // Validate ID token
    const validation = validateJWT(
      tokens.id_token,
      ssoConfig.authServerUrl,
      ssoConfig.clientId
    );

    if (!validation.valid) {
      console.error('Token validation failed:', validation.error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(validation.error || 'Token validation failed')}`, request.url)
      );
    }

    // Get user info
    const userInfo = await getUserInfo(tokens.access_token);

    // Store tokens in HTTP-only cookies (secure)
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // Set access token cookie (HTTP-only, secure, SameSite=Lax)
    response.cookies.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600, // Default 1 hour
      path: '/',
    });

    // Set ID token cookie
    response.cookies.set('id_token', tokens.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
      path: '/',
    });

    // Store refresh token if provided
    if (tokens.refresh_token) {
      response.cookies.set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    // Store user info in a separate cookie for client-side access
    response.cookies.set('user_info', JSON.stringify({
      uid: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      emailVerified: userInfo.email_verified,
    }), {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
      path: '/',
    });

    // Clear oauth_state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}
