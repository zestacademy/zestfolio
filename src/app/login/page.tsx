'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getAuthorizationUrl, generateState } from '@/lib/sso-config';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const userInfoCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_info='));

    if (userInfoCookie) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLoginWithZestAcademy = () => {
    setIsRedirecting(true);
    
    try {
      // Generate state parameter for CSRF protection
      const state = generateState();
      
      // Store state in cookie for validation on callback
      document.cookie = `oauth_state=${state}; path=/; max-age=600; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
      
      // Redirect to authorization server
      const authUrl = getAuthorizationUrl(state);
      window.location.href = authUrl;
    } catch (err) {
      console.error('Login error:', err);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Welcome to Zestfolio</h1>
          <p className="text-muted-foreground text-sm">
            Sign in with your ZestAcademy account
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleLoginWithZestAcademy}
          disabled={isRedirecting}
          className="w-full"
          size="lg"
        >
          {isRedirecting ? 'Redirecting...' : 'Login with ZestAcademy'}
        </Button>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            By signing in, you agree to our{' '}
            <a href="/terms-conditions" className="text-primary hover:underline">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-sm mb-2">Single Sign-On (SSO)</h3>
          <p className="text-xs text-muted-foreground">
            One ZestAcademy account works across all platforms:
          </p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1">
            <li>• zestacademy.tech</li>
            <li>• zestfolio.tech</li>
            <li>• zestcompilers.tech</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
