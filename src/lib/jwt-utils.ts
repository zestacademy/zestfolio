/**
 * JWT Token Validation and Management
 * Used for validating tokens from ZestAcademy SSO
 */

/**
 * Decode JWT without verification (for reading payload)
 */
export function decodeJWT(token: string): Record<string, unknown> | null {
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
  payload?: Record<string, unknown>;
  error?: string;
} {
  try {
    const payload = decodeJWT(token);
    
    if (!payload) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && (payload.exp as number) < now) {
      return { valid: false, error: 'Token expired' };
    }

    // Check not before
    if (payload.nbf && (payload.nbf as number) > now) {
      return { valid: false, error: 'Token not yet valid' };
    }

    // Validate issuer
    if (payload.iss !== expectedIssuer) {
      return { valid: false, error: 'Invalid issuer' };
    }

    // Validate audience (can be string or array of strings)
    const audienceMatch = typeof payload.aud === 'string'
      ? payload.aud === expectedAudience
      : Array.isArray(payload.aud) && payload.aud.includes(expectedAudience);
    
    if (!audienceMatch) {
      return { valid: false, error: 'Invalid audience' };
    }

    return { valid: true, payload };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { valid: false, error: errorMessage };
  }
}

/**
 * Extract user info from JWT payload
 */
export function extractUserInfo(payload: Record<string, unknown>): {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified?: boolean;
} {
  const uid = (payload.sub || payload.user_id) as string;
  const email = payload.email as string;
  
  if (!uid) {
    throw new Error('JWT payload missing required "sub" or "user_id" field');
  }
  
  if (!email) {
    throw new Error('JWT payload missing required "email" field');
  }
  
  return {
    uid,
    email,
    name: payload.name as string | undefined || payload.full_name as string | undefined,
    picture: payload.picture as string | undefined || payload.avatar as string | undefined,
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
  return (payload.exp as number) < now;
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): number | null {
  const payload = decodeJWT(token);
  return (payload?.exp as number) || null;
}
