'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getUserInfoFromCookie, setCookie } from '@/lib/cookie-utils';
import { getAuthorizationUrl, generateState } from '@/lib/sso-config';
import { getGoogleAuthorizationUrl } from '@/lib/google-auth-client';
import Link from 'next/link';

export default function SignupPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const userInfo = getUserInfoFromCookie();
    if (userInfo) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSignupWithGoogle = () => {
    setIsRedirecting(true);
    
    try {
      // Generate state parameter for CSRF protection
      const state = generateState();
      
      // Store state in cookie for validation on callback
      setCookie('google_oauth_state', state, {
        maxAge: 600, // 10 minutes
        secure: process.env.NODE_ENV === 'production',
      });
      
      // Redirect to Google authorization
      const authUrl = getGoogleAuthorizationUrl(state);
      window.location.href = authUrl;
    } catch (err) {
      console.error('Signup error:', err);
      setIsRedirecting(false);
    }
  };

  const handleSignupWithZestAcademy = () => {
    setIsRedirecting(true);
    
    try {
      // Generate state parameter for CSRF protection
      const state = generateState();
      
      // Store state in cookie for validation on callback
      setCookie('oauth_state', state, {
        maxAge: 600, // 10 minutes
        secure: process.env.NODE_ENV === 'production',
      });
      
      // Redirect to authorization server
      const authUrl = getAuthorizationUrl(state);
      window.location.href = authUrl;
    } catch (err) {
      console.error('Signup error:', err);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
          <p className="text-muted-foreground text-sm">
            Sign up to get started
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-muted-foreground">
            Choose your preferred sign-in method:
          </p>

          <Button 
            onClick={handleSignupWithGoogle}
            disabled={isRedirecting}
            className="w-full" 
            size="lg"
            variant="outline"
          >
            {isRedirecting ? 'Redirecting...' : 'Continue with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            onClick={handleSignupWithZestAcademy}
            disabled={isRedirecting}
            className="w-full" 
            size="lg"
          >
            {isRedirecting ? 'Redirecting...' : 'Continue with ZestAcademy'}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Multiple Sign-In Options</h3>
          <p className="text-xs text-muted-foreground">
            Sign in with Google or your ZestAcademy account to access all platforms:
          </p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
            <li>• zestacademy.tech</li>
            <li>• zestfolio.tech</li>
            <li>• zestcompilers.tech</li>
          </ul>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
