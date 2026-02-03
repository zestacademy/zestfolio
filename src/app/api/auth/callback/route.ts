/**
 * OAuth 2.0 Authorization Callback Handler
 * Handles the redirect from auth.zestacademy.tech with authorization code
 * Supports both legacy flow (GET) and PKCE flow (POST with code_verifier)
 */

import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getUserInfo, ssoConfig } from '@/lib/sso-config';
import { validateJWT } from '@/lib/jwt-utils';
import { cookies } from 'next/headers';

/**
 * GET handler - Redirect from auth server (legacy flow or PKCE redirect to frontend)
 * For PKCE: redirects to /auth/callback page which will POST with code_verifier
 */
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

    // For PKCE flow: Redirect to frontend callback page
    // The frontend will verify state, get code_verifier from sessionStorage,
    // and POST back to this API with the code_verifier
    if (code && state) {
      return NextResponse.redirect(
        new URL(`/auth/callback?code=${code}&state=${state}`, request.url)
      );
    }

    return NextResponse.redirect(
      new URL('/login?error=Missing+authorization+code', request.url)
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}

/**
 * POST handler - Complete PKCE flow with code_verifier
 * Called by frontend /auth/callback page with code_verifier from sessionStorage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, state, code_verifier } = body;

    // Validate required parameters
    if (!code || !state || !code_verifier) {
      return NextResponse.json(
        { error: 'missing_params', message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Exchange code for tokens with PKCE code_verifier
    const tokens = await exchangeCodeForTokens(code, code_verifier);

    // Validate ID token
    const validation = validateJWT(
      tokens.id_token,
      ssoConfig.authServerUrl,
      ssoConfig.clientId
    );

    if (!validation.valid) {
      console.error('Token validation failed:', validation.error);
      return NextResponse.json(
        { error: 'token_validation_failed', message: validation.error || 'Token validation failed' },
        { status: 401 }
      );
    }

    // Get user info
    const userInfo = await getUserInfo(tokens.access_token);

    // Create response with cookies
    const response = NextResponse.json({ success: true }, { status: 200 });
    
    const cookieStore = await cookies();
    
    // Set access token cookie (HTTP-only, secure, SameSite=Lax)
    cookieStore.set('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600, // Default 1 hour
      path: '/',
    });

    // Set ID token cookie
    cookieStore.set('id_token', tokens.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
      path: '/',
    });

    // Store refresh token if provided
    if (tokens.refresh_token) {
      cookieStore.set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
      });
    }

    // Store user info in a separate cookie for client-side access
    cookieStore.set('user_info', JSON.stringify({
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

    return response;
  } catch (error) {
    console.error('OAuth callback POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json(
      { error: 'auth_failed', message: errorMessage },
      { status: 500 }
    );
  }
}
