'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    if (error) {
      router.push(`/login?error=${error}`)
      return
    }
    
    if (!code || !state) {
      router.push('/login?error=missing_params')
      return
    }
    
    // Verify state
    const savedState = sessionStorage.getItem('oauth_state')
    if (state !== savedState) {
      router.push('/login?error=invalid_state')
      return
    }
    
    // Get code_verifier
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier')
    if (!codeVerifier) {
      router.push('/login?error=missing_verifier')
      return
    }
    
    // Send to backend API with code_verifier
    fetch('/api/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        state,
        code_verifier: codeVerifier,
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          // Clean up
          sessionStorage.removeItem('pkce_code_verifier')
          sessionStorage.removeItem('oauth_state')
          
          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          const error = await res.json()
          router.push(`/login?error=${error.error || 'auth_failed'}`)
        }
      })
      .catch(() => {
        router.push('/login?error=network_error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams])
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Completing authentication...</p>
      </div>
    </div>
  )
}
