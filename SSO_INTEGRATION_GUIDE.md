# Single Sign-On (SSO) Integration Guide

## Overview

Zestfolio now uses **Single Sign-On (SSO)** via `auth.zestacademy.tech` for authentication. This provides a seamless login experience across all ZestAcademy platforms:

- zestacademy.tech
- zestfolio.tech
- zestcompilers.tech

## Authentication Architecture

### OAuth 2.0 Authorization Code Flow

The implementation follows the OAuth 2.0 Authorization Code Flow, which is the most secure method for web applications:

```
┌─────────┐                               ┌──────────────┐
│         │ 1. Login Button Click         │              │
│  User   │──────────────────────────────>│  Zestfolio   │
│         │                               │   (Client)   │
└─────────┘                               └──────────────┘
     │                                           │
     │ 2. Redirect to Auth Server               │
     │<─────────────────────────────────────────│
     │                                           │
     v                                           │
┌──────────────────┐                            │
│                  │ 3. User Login              │
│  auth.zestacademy│    & Consent               │
│      .tech       │                            │
│  (Auth Server)   │                            │
└──────────────────┘                            │
     │                                           │
     │ 4. Authorization Code                    │
     │──────────────────────────────────────────>
     │                                           │
     │                              5. Exchange Code for Tokens
     │                              <──────────────────────────>
     │                                           │
     │                              6. Store Tokens (HTTP-only)
     │                                           │
     │ 7. Access Dashboard                      │
     │<─────────────────────────────────────────│
```

## Security Features

### ✅ Implemented Security Measures

1. **No Password Storage**: Passwords are never handled by Zestfolio
2. **HTTP-Only Cookies**: Tokens stored in secure HTTP-only cookies
3. **CSRF Protection**: State parameter validation on callback
4. **Backend-Only Token Exchange**: Client secret never exposed to frontend
5. **JWT Validation**: Token expiry and issuer validation
6. **Secure Cookie Options**:
   - `httpOnly: true` - Prevents JavaScript access
   - `secure: true` - HTTPS only in production
   - `sameSite: 'lax'` - CSRF protection

### 🔐 Token Management

#### Access Token
- **Purpose**: Authenticates API requests
- **Storage**: HTTP-only cookie
- **Lifetime**: 1 hour (configurable)
- **Refresh**: Automatic via refresh token

#### ID Token
- **Purpose**: User identity information (JWT)
- **Storage**: HTTP-only cookie
- **Contains**: User ID, email, name, picture
- **Validation**: Issuer and audience checks

#### Refresh Token
- **Purpose**: Obtain new access tokens
- **Storage**: HTTP-only cookie
- **Lifetime**: 30 days
- **Usage**: Backend-only rotation

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file with the following:

```env
# ZestAcademy SSO Configuration
NEXT_PUBLIC_SSO_AUTH_URL=https://auth.zestacademy.tech
NEXT_PUBLIC_SSO_CLIENT_ID=zestfolio
NEXT_PUBLIC_SSO_REDIRECT_URI=https://zestfolio.tech/api/auth/callback
SSO_CLIENT_SECRET=your_client_secret_here

# JWT Configuration (for additional validation)
JWT_SECRET=your_jwt_secret_here_min_32_chars
```

### Configuration Notes

- `NEXT_PUBLIC_*` variables are accessible in the browser
- `SSO_CLIENT_SECRET` is **NEVER** exposed to the client
- All token exchanges happen server-side

## API Endpoints

### 1. Authorization Initiation
**Frontend Only** - Redirects to auth server

```typescript
// User clicks "Login with ZestAcademy"
const state = generateState(); // CSRF token
const authUrl = getAuthorizationUrl(state);
window.location.href = authUrl;
```

### 2. OAuth Callback
**Route**: `/api/auth/callback`
**Method**: GET
**Query Parameters**:
- `code`: Authorization code from auth server
- `state`: CSRF protection token

**Flow**:
1. Validate state parameter
2. Exchange code for tokens (backend only)
3. Validate JWT tokens
4. Store tokens in HTTP-only cookies
5. Redirect to dashboard

### 3. Session Check
**Route**: `/api/auth/session`
**Method**: GET
**Returns**: Current user session or 401

```json
{
  "authenticated": true,
  "user": {
    "uid": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://...",
    "emailVerified": true
  }
}
```

### 4. Logout
**Route**: `/api/auth/logout`
**Method**: GET or POST

**Flow**:
1. Clear all auth cookies
2. Redirect to auth server logout
3. Auth server performs global logout
4. Redirect back to home page

## Client-Side Components

### Login Page

```typescript
// src/app/login/page.tsx
import { getAuthorizationUrl, generateState } from '@/lib/sso-config';

const handleLogin = () => {
  const state = generateState();
  document.cookie = `oauth_state=${state}; path=/; max-age=600`;
  window.location.href = getAuthorizationUrl(state);
};
```

### Auth Context

```typescript
// src/lib/auth-context.tsx
const { user, loading } = useAuth();

// user.uid, user.email, user.name available
```

### Protected Routes

```typescript
// Dashboard layout checks authentication
useEffect(() => {
  if (!loading && !user) {
    router.push('/login');
  }
}, [user, loading]);
```

## Migration from Firebase Auth

### What Changed

1. **Login Flow**: Direct Firebase → OAuth redirect flow
2. **User Object**: Firebase User → SSO User interface
3. **Token Storage**: Firebase SDK → HTTP-only cookies
4. **Email Verification**: Firebase verification → SSO handles it
5. **Logout**: `signOut(auth)` → `window.location.href = '/api/auth/logout'`

### What Stayed the Same

- Firebase Firestore for data storage
- Firebase Storage for file uploads
- User ID (`uid`) remains consistent
- Dashboard and UI components unchanged

### Backwards Compatibility

Old Firebase auth files are backed up with `.bak` extension:
- `src/app/login/page-firebase.tsx.bak`
- `src/app/dashboard/layout-firebase.tsx.bak`
- `src/lib/auth-context-firebase.tsx.bak`

## Testing Checklist

### Manual Testing

- [ ] Login redirects to auth.zestacademy.tech
- [ ] Callback handles authorization code
- [ ] User session persists across page refreshes
- [ ] Dashboard loads user data correctly
- [ ] Logout clears all cookies
- [ ] Global logout works across platforms
- [ ] Expired tokens trigger re-authentication
- [ ] CSRF protection blocks invalid state

### Integration Testing

```bash
# 1. Test login flow
curl -v https://zestfolio.tech/login

# 2. Test callback (after auth)
curl -v 'https://zestfolio.tech/api/auth/callback?code=xxx&state=xxx'

# 3. Test session
curl -v https://zestfolio.tech/api/auth/session

# 4. Test logout
curl -v https://zestfolio.tech/api/auth/logout
```

## Troubleshooting

### Issue: "Invalid state parameter"
**Cause**: CSRF token mismatch or expired
**Fix**: Ensure cookies are enabled and not blocked

### Issue: "Token expired"
**Cause**: Access token lifetime exceeded
**Fix**: Implement refresh token flow or re-authenticate

### Issue: "Authentication failed"
**Cause**: Token exchange failed
**Fix**: Verify `SSO_CLIENT_SECRET` and auth server availability

### Issue: Session not persisting
**Cause**: Cookies not being set
**Fix**: Check cookie settings and HTTPS in production

## Security Best Practices

### ✅ Do's

- Keep `SSO_CLIENT_SECRET` private
- Use HTTPS in production
- Validate all tokens server-side
- Set appropriate cookie expiration
- Log authentication errors
- Monitor for suspicious activity

### ❌ Don'ts

- Don't store tokens in localStorage
- Don't expose client secret in frontend
- Don't skip state validation
- Don't trust client-side token validation
- Don't share tokens across domains
- Don't log sensitive token data

## Production Deployment

### Pre-Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure HTTPS/SSL
- [ ] Update redirect URIs in auth server
- [ ] Test in staging environment
- [ ] Verify cookie security settings
- [ ] Enable error monitoring
- [ ] Configure rate limiting
- [ ] Review security headers

### Post-Deployment

- [ ] Monitor authentication success rate
- [ ] Check error logs regularly
- [ ] Test logout flow
- [ ] Verify token refresh works
- [ ] Test across different browsers
- [ ] Validate mobile experience

## Support

For authentication issues or questions:

1. Check this documentation
2. Review error logs in dashboard
3. Contact ZestAcademy support: zestacademy@rsmk.co.in

## Future Enhancements

Planned improvements:

- [ ] Automatic token refresh
- [ ] Remember me functionality
- [ ] Multi-factor authentication (MFA)
- [ ] Social login providers
- [ ] Session management dashboard
- [ ] Audit log for authentication events
