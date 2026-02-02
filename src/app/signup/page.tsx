'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getUserInfoFromCookie } from '@/lib/cookie-utils';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    const userInfo = getUserInfoFromCookie();
    if (userInfo) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Create an Account</h1>
          <p className="text-muted-foreground text-sm">
            Sign up with your ZestAcademy account
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Zestfolio uses Single Sign-On (SSO) through ZestAcademy. 
            You can create an account and sign in using the same button.
          </p>

          <Link href="/login">
            <Button className="w-full" size="lg">
              Login with ZestAcademy
            </Button>
          </Link>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-sm mb-2">One Account, All Platforms</h3>
          <p className="text-xs text-muted-foreground">
            Your ZestAcademy account works across:
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
