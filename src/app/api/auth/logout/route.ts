/**
 * Logout Endpoint
 * Clears local tokens and redirects to auth server logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLogoutUrl } from '@/lib/sso-config';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(
    getLogoutUrl(new URL('/', request.url).toString())
  );

  // Clear all auth cookies
  response.cookies.delete('access_token');
  response.cookies.delete('id_token');
  response.cookies.delete('refresh_token');
  response.cookies.delete('user_info');
  response.cookies.delete('oauth_state');

  return response;
}

export async function POST(request: NextRequest) {
  // Also support POST for logout
  return GET(request);
}
