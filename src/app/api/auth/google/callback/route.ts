/**
 * Google OAuth 2.0 Callback Handler
 * Handles the redirect from Google with authorization code
 */

import { NextRequest, NextResponse } from 'next/server';
import { exchangeGoogleCodeForTokens, getGoogleUserInfo } from '@/lib/google-auth-server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle error from Google
    if (error) {
      console.error('Google authorization error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    // Validate state parameter (CSRF protection)
    const cookieStore = await cookies();
    const storedState = cookieStore.get('google_oauth_state')?.value;
    
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

    // Exchange code for tokens
    const tokens = await exchangeGoogleCodeForTokens(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL('/login?error=Failed+to+get+access+token', request.url)
      );
    }

    // Get user info from Google
    const userInfo = await getGoogleUserInfo(tokens.access_token);

    // Store tokens in HTTP-only cookies (secure)
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    
    // Set access token cookie
    response.cookies.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
      path: '/',
    });

    // Set ID token cookie if available
    if (tokens.id_token) {
      response.cookies.set('id_token', tokens.id_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokens.expires_in || 3600,
        path: '/',
      });
    }

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
      uid: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      emailVerified: userInfo.verified_email,
      provider: 'google',
    }), {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
      path: '/',
    });

    // Clear google_oauth_state cookie
    response.cookies.delete('google_oauth_state');

    return response;
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}
