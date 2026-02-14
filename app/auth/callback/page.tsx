'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase-client-auth'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Signing you in...')
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setDebugInfo('Waiting for session...')

        // Wait for session to be available (Supabase sets cookie)
        // Give it more time for cookies to sync properly
        let attempts = 0
        let session = null
        const maxAttempts = 20 // Increased from 10 to 20

        while (attempts < maxAttempts && !session) {
          const { data } = await supabase.auth.getSession()
          session = data.session

          if (session) {
            setDebugInfo(`Session found! User: ${session.user?.email}`)
            break
          }

          if (!session) {
            await new Promise(r => setTimeout(r, 300)) // Increased from 200 to 300ms
            attempts++
            setDebugInfo(`Waiting for session... (${attempts}/${maxAttempts})`)
          }
        }

        if (!session) {
          setDebugInfo('No session found after waiting')
          console.error('[AuthCallback] No session found after max attempts')
          // Use setTimeout to allow state update before redirect
          setTimeout(() => {
            router.replace('/organization/login?error=no_session')
          }, 100)
          return
        }

        setStatus('Checking organization status...')
        setDebugInfo('Fetching organization data...')

        // Small delay to ensure cookies are properly set before API call
        await new Promise(r => setTimeout(r, 500))

        // Check organization status via API
        const res = await fetch('/api/organizations/me', {
          credentials: 'include', // Ensure cookies are sent
        })

        const data = await res.json()

        if (!res.ok) {
          setDebugInfo(`API Error: ${data.error || 'Unknown error'}`)
          // No organization - go to registration
          setTimeout(() => {
            router.replace('/organization/register')
          }, 100)
          return
        }

        // Has organization - check verification status
        const orgStatus = data.organization?.verification_status

        setDebugInfo(`Org status: ${orgStatus || 'none'}`)

        setTimeout(() => {
          if (orgStatus === 'pending') {
            router.replace('/organization/pending')
          } else if (orgStatus === 'rejected') {
            router.replace('/organization/rejected')
          } else if (orgStatus === 'approved') {
            router.replace('/organization/dashboard')
          } else {
            // Fallback - go to pending if unknown status
            router.replace('/organization/pending')
          }
        }, 100)
      } catch (error) {
        console.error('Auth callback error:', error)
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown'}`)
        setTimeout(() => {
          router.replace('/organization/login?error=callback_failed')
        }, 100)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-600" />
        <p className="text-gray-600 text-lg">{status}</p>
        {debugInfo && (
          <p className="text-gray-500 text-sm">{debugInfo}</p>
        )}
      </div>
    </div>
  )
}
