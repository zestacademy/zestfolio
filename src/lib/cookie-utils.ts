/**
 * Cookie utility functions for SSO authentication
 */

/**
 * Get a cookie value by name (client-side only)
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split('=')[1]);
}

/**
 * Get user info from cookie
 */
export function getUserInfoFromCookie(): {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
} | null {
  const userInfoCookie = getCookie('user_info');
  
  if (!userInfoCookie) {
    return null;
  }

  try {
    return JSON.parse(userInfoCookie);
  } catch (error) {
    console.error('Failed to parse user_info cookie:', error);
    return null;
  }
}

/**
 * Set a cookie (client-side only)
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): void {
  if (typeof document === 'undefined') {
    return;
  }

  const {
    maxAge,
    path = '/',
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'lax',
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }

  if (secure) {
    cookieString += '; Secure';
  }

  document.cookie = cookieString;
}

/**
 * Delete a cookie (client-side only)
 */
export function deleteCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=; path=${path}; max-age=0`;
}
