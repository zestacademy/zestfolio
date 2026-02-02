# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication for Zestfolio.

## Overview

Zestfolio now supports multiple authentication methods:
- **Google OAuth 2.0**: Sign in with your Google account
- **ZestAcademy SSO**: Sign in with your ZestAcademy account

Both methods use OAuth 2.0 authorization code flow for secure authentication.

## Prerequisites

- Google Cloud Console account
- Access to Google Cloud project or ability to create one

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API"
3. Click **Enable**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - Select **External** user type
   - Fill in required information:
     - App name: **Zestfolio**
     - User support email: Your email
     - Developer contact information: Your email
   - Add scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Add test users if needed
4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: **Zestfolio**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://zestfolio.tech` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://zestfolio.tech/api/auth/google/callback` (for production)
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

## Step 4: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

For production, update the redirect URI:
```env
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://zestfolio.tech/api/auth/google/callback
```

## Step 5: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click **Continue with Google**

4. You should be redirected to Google's login page

5. After successful authentication, you'll be redirected back to the dashboard

## Security Features

### OAuth 2.0 Authorization Code Flow
- User clicks "Continue with Google"
- Redirected to Google's authorization server
- User authenticates with Google
- Google redirects back with authorization code
- Backend exchanges code for access token (secure)
- Token stored in HTTP-only cookie
- User redirected to dashboard

### CSRF Protection
- State parameter generated and stored in cookie
- Validated on callback to prevent CSRF attacks

### Token Security
- Access tokens stored in HTTP-only cookies
- Never exposed to JavaScript
- Secure flag set in production
- SameSite=Lax for CSRF protection

### User Information
- User info stored in separate cookie for client-side access
- Includes: uid, email, name, picture, emailVerified
- Provider flag set to 'google' for tracking

## How It Works

### Login Flow

1. **Client Side** (`src/app/login/page.tsx`):
   - User clicks "Continue with Google"
   - Generates CSRF state token
   - Stores state in cookie
   - Redirects to Google authorization URL

2. **Google Authorization**:
   - User logs in with Google credentials
   - Google redirects to callback URL with code

3. **Server Side** (`src/app/api/auth/google/callback/route.ts`):
   - Validates state parameter (CSRF check)
   - Exchanges authorization code for tokens
   - Fetches user info from Google
   - Stores tokens in HTTP-only cookies
   - Redirects to dashboard

### Code Structure

```
src/
├── lib/
│   ├── google-auth-client.ts    # Client-side config (safe for browser)
│   └── google-auth-server.ts    # Server-side implementation (API routes only)
├── app/
│   ├── login/page.tsx            # Login page with Google button
│   ├── signup/page.tsx           # Signup page with Google button
│   └── api/auth/google/
│       └── callback/route.ts     # OAuth callback handler
```

### Configuration Files

- **google-auth-client.ts**: Client-side configuration, safe to import in browser
- **google-auth-server.ts**: Server-side implementation, only imported in API routes

This separation prevents build issues with Node.js-only modules.

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Check that the redirect URI in Google Cloud Console matches exactly
- Ensure you're using the correct URI for development/production
- URI must include protocol (http:// or https://)

### Error: "invalid_client"
- Verify Client ID and Client Secret are correct
- Check that credentials haven't been revoked
- Ensure you're using the correct environment variables

### Error: "access_denied"
- User declined authorization
- Check OAuth consent screen configuration
- Ensure user has access (not blocked by test users list)

### State Mismatch Error
- CSRF token validation failed
- Clear cookies and try again
- Check cookie settings (secure flag, sameSite)

### Build Errors
- Ensure google-auth-library is NOT installed
- Use manual OAuth implementation (already in place)
- Verify imports use google-auth-client.ts (not google-auth-config.ts)

## Production Deployment

### Pre-Deployment Checklist
- [ ] OAuth client configured in Google Cloud Console
- [ ] Production redirect URI added to authorized URIs
- [ ] Environment variables set in production
- [ ] HTTPS enabled (required for OAuth in production)
- [ ] Test login flow in staging environment

### Environment Variables (Production)
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://zestfolio.tech/api/auth/google/callback
```

### Security Considerations
- Never commit `GOOGLE_CLIENT_SECRET` to version control
- Use environment variables for all secrets
- Enable HTTPS in production (OAuth requires it)
- Set secure cookie flags in production
- Monitor for suspicious authentication attempts

## API Reference

### Client-Side Functions

**getGoogleAuthorizationUrl(state: string): string**
- Generates Google OAuth authorization URL
- Parameters:
  - `state`: CSRF protection token
- Returns: Authorization URL string

### Server-Side Functions

**exchangeGoogleCodeForTokens(code: string): Promise<Tokens>**
- Exchanges authorization code for access tokens
- Parameters:
  - `code`: Authorization code from Google
- Returns: Token object with access_token, id_token, refresh_token, expires_in

**getGoogleUserInfo(accessToken: string): Promise<UserInfo>**
- Fetches user information from Google
- Parameters:
  - `accessToken`: Access token from token exchange
- Returns: User info object with id, email, name, picture, verified_email

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OAuth 2.0 Authorization Code Flow](https://oauth.net/2/grant-types/authorization-code/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## Support

For issues or questions about Google OAuth integration:
- Check the troubleshooting section above
- Review environment variable configuration
- Verify Google Cloud Console settings
- Contact: zestacademy@rsmk.co.in
