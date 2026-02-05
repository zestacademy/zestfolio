'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, LogIn, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

function LoginContent() {
  const { user, profile, loading, signInWithGoogle, isProcessingGoogleLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  useEffect(() => {
    if (urlError) setError(urlError);
  }, [urlError]);

  useEffect(() => {
    // Check if new user was created in AuthContext
    if (typeof window !== 'undefined' && (window as any).__NEW_USER_CREATED__) {
      setShowWelcome(true);
      delete (window as any).__NEW_USER_CREATED__;
    } else if (user && profile && !isProcessingGoogleLogin && !showWelcome) {
      // If user exists and not new, redirect to dashboard
      router.push('/dashboard');
    }
  }, [user, profile, isProcessingGoogleLogin, router, showWelcome]);

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to continue to Zestfolio
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={isProcessingGoogleLogin}
            className="w-full h-12 text-base font-medium"
            variant="outline"
          >
            {isProcessingGoogleLogin ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                Continue with Google
              </span>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full h-12 text-base font-medium" disabled>
              <Mail className="w-4 h-4 mr-2" />
              Email & Password (Coming Soon)
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </a>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground border-t pt-6">
          <p>
            By signing in, you agree to our{' '}
            <a href="/terms-conditions" className="text-primary hover:underline">Terms</a>
            {' '}and{' '}
            <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>

      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <DialogTitle className="text-2xl font-bold">Welcome to Zestfolio!</DialogTitle>
            <DialogDescription className="text-base pt-2">
              We're excited to have you here, <span className="font-semibold text-foreground">{profile?.displayName}</span>!
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-6 rounded-lg border text-center my-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Your Unique Zest ID</p>
            <p className="text-4xl font-mono font-bold text-primary">{profile?.zestId}</p>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseWelcome} className="w-full h-12 text-lg">
              Get Started
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
