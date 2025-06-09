import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase/supabaseClient'
import { getUserProfile } from '../supabase/queries'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    let authListener = null

    const initAuth = async () => {
      try {
        // Keep loading true until we've handled both the session and auth state change
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          if (mounted.current) {
            setError(sessionError.message)
            setLoading(false)
          }
          return
        }

        // Set up auth state listener before handling the session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (mounted.current) {
            if (session?.user) {
              setUser(session.user)
              try {
                const userProfile = await getUserProfile(session.user.id)
                if (mounted.current) {
                  setProfile(userProfile)
                }
              } catch (error) {
                console.error('Profile fetch error:', error)
                if (mounted.current) {
                  setError(error.message)
                }
              }
            } else {
              setUser(null)
              setProfile(null)
            }
            // Only set loading to false after we've handled the auth state
            setLoading(false)
          }
        })
        
        authListener = subscription

        // Handle initial session
        if (mounted.current) {
          if (session?.user) {
            setUser(session.user)
            try {
              const userProfile = await getUserProfile(session.user.id)
              if (mounted.current) {
                setProfile(userProfile)
              }
            } catch (profileError) {
              console.error('Profile error:', profileError)
              if (mounted.current) {
                setError(profileError.message)
              }
            }
          } else {
            setUser(null)
            setProfile(null)
          }
          // Don't set loading to false here, let the auth state listener handle it
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted.current) {
          setError(error.message)
          setLoading(false)
        }
      }
    }

    initAuth()

    return () => {
      mounted.current = false
      if (authListener) {
        authListener.unsubscribe()
      }
    }
  }, [])

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      })

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('This email is already registered. Please log in instead.')
        }
        throw error
      }

      return {
        data,
        needsEmailVerification: !data.session
      }
    } catch (error) {
      if (mounted.current) {
        setError(error.message)
      }
      throw error
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please try again.')
        }
        throw error
      }

      if (data.user && mounted.current) {
        setUser(data.user)
        try {
          const userProfile = await getUserProfile(data.user.id)
          if (mounted.current) {
            setProfile(userProfile)
          }
        } catch (error) {
          console.error('Profile fetch error:', error)
          if (mounted.current) {
            setError(error.message)
          }
        }
      }

      return data
    } catch (error) {
      if (mounted.current) {
        setError(error.message)
      }
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      if (mounted.current) {
        setUser(null)
        setProfile(null)
        setError(null)
      }
      
      return true
    } catch (error) {
      if (mounted.current) {
        setError(error.message)
      }
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
    } catch (error) {
      if (mounted.current) {
        setError(error.message)
      }
      throw error
    }
  }

  const updatePassword = async (password) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      if (error) throw error
    } catch (error) {
      if (mounted.current) {
        setError(error.message)
      }
      throw error
    }
  }

  const value = {
    user,
    profile,
    setProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

if (import.meta.hot) {
  import.meta.hot.accept()
}