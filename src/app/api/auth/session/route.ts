/**
 * Session Endpoint
 * Returns current user session info from cookies
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isTokenExpired } from '@/lib/jwt-utils';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info');
    const accessToken = cookieStore.get('access_token');

    if (!userInfoCookie || !accessToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Check if access token is expired
    if (isTokenExpired(accessToken.value)) {
      return NextResponse.json({ authenticated: false, error: 'Token expired' }, { status: 401 });
    }

    const userInfo = JSON.parse(userInfoCookie.value);

    return NextResponse.json({
      authenticated: true,
      user: userInfo,
    });
  } catch (error: any) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
