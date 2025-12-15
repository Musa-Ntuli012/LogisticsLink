import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState(null)
  const [role, setRole] = useState('viewer')

  useEffect(() => {
    let ignore = false

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (!ignore) {
        setSession(data.session ?? null)
        setLoading(false)
      }
      if (data.session) {
        await fetchCompany()
      }
    }

    async function fetchCompany() {
      try {
        // Get the current user's company via company_users join
        const { data, error } = await supabase
          .from('company_users')
          .select('role, companies(*)')
          .single()

        if (error) {
          // eslint-disable-next-line no-console
          console.error('Error loading company/licence info:', error)
          setCompany(null)
          return
        }

        setCompany(data?.companies ?? null)
        setRole(data?.role ?? 'viewer')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in fetchCompany:', error)
        setCompany(null)
        setRole('viewer')
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (newSession) {
        fetchCompany()
      } else {
        setCompany(null)
      }
    })

    init()

    return () => {
      ignore = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const licenceExpired =
    company?.licence_expires_at && new Date(company.licence_expires_at) < new Date()

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        company,
        licenceExpired,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


