/**
 * JWT Token Validation and Management
 * Used for validating tokens from ZestAcademy SSO
 */

/**
 * Decode JWT without verification (for reading payload)
 */
export function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const payload = parts[1];
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Validate JWT token (basic validation)
 * In production, you should verify the signature with the auth server's public key
 */
export function validateJWT(token: string, expectedIssuer: string, expectedAudience: string): {
  valid: boolean;
  payload?: any;
  error?: string;
} {
  try {
    const payload = decodeJWT(token);
    
    if (!payload) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }

    // Check not before
    if (payload.nbf && payload.nbf > now) {
      return { valid: false, error: 'Token not yet valid' };
    }

    // Validate issuer
    if (payload.iss !== expectedIssuer) {
      return { valid: false, error: 'Invalid issuer' };
    }

    // Validate audience
    if (payload.aud !== expectedAudience && !payload.aud?.includes(expectedAudience)) {
      return { valid: false, error: 'Invalid audience' };
    }

    return { valid: true, payload };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Extract user info from JWT payload
 */
export function extractUserInfo(payload: any): {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
} {
  return {
    uid: payload.sub || payload.user_id,
    email: payload.email,
    name: payload.name || payload.full_name,
    picture: payload.picture || payload.avatar,
    emailVerified: payload.email_verified === true,
  };
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): number | null {
  const payload = decodeJWT(token);
  return payload?.exp || null;
}
