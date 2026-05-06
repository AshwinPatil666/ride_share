import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { IS_DEMO_MODE, demoAuth, DemoSession } from '../lib/demo'
import { Profile } from '../types'

interface AuthContextType {
  session: Session | DemoSession | null
  user: (User & { profile?: Profile }) | Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | DemoSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (IS_DEMO_MODE) {
      demoAuth.init()
      const demoSession = demoAuth.getSession()
      setSession(demoSession)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    if (IS_DEMO_MODE) {
      demoAuth.signOut()
      setSession(null)
      return
    }
    await supabase.auth.signOut()
  }

  const user = IS_DEMO_MODE
    ? (session as DemoSession | null)?.user ?? null
    : (session as Session | null)?.user ?? null

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
