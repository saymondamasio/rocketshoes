import Router from 'next/router'
import { destroyCookie } from 'nookies'
import { createContext, ReactNode, useEffect, useState } from 'react'
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import { usePersistedState } from '../hooks/usePersistedState'
import { api } from '../services/api-client'

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => void
  user: User | undefined
  isAuthenticated: boolean
  modalIsOpen: boolean
  closeModal: () => void
  signInModal: () => void
  signInWithGoogle: (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => void
}

let authChannel: BroadcastChannel

export function signOut() {
  destroyCookie(undefined, 'nextauth.token')

  authChannel.postMessage('signOut')

  Router.push('/')
}

export const AuthContext = createContext({} as AuthContextData)

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User>()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [token, setToken] = usePersistedState<string | undefined>(
    '@rocketshoes:token',
    undefined
  )

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = message => {
      switch (message.data) {
        case 'signOut':
          Router.push('/')
          break
        case 'signIn':
          window.location.reload()
          break
        default:
          break
      }
    }
  }, [])

  useEffect(() => {
    if (token) {
      api
        .get('/profile')
        .then(response => {
          const { email, permissions, roles } = response.data

          setUser({ email, permissions, roles })
        })
        .catch(() => signOut())
    }
  }, [token])

  async function signInModal() {
    setModalIsOpen(true)
  }

  function closeModal() {
    setModalIsOpen(false)
  }

  async function signInWithGoogle(
    responseGoogle: GoogleLoginResponse | GoogleLoginResponseOffline
  ) {
    console.log('success', responseGoogle)
    if ('accessToken' in responseGoogle) {
      const { accessToken: tokenGoogle } = responseGoogle
      const response = await api.post('auth/google', { token: tokenGoogle })
      console.log(response.data, tokenGoogle)
      const { token } = response.data
      setToken(token)

      //@ts-ignore
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      const responseProfile = await api.get('profile')
      const { email, permissions, roles } = responseProfile.data
      setUser({
        email,
        roles,
        permissions,
      })
      setModalIsOpen(false)
    }
  }

  async function signIn(credentials: SignInCredentials) {
    try {
      const response = await api.post('auth/login', credentials)

      const { token } = response.data

      //@ts-ignore
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      const responseProfile = await api.get('profile')

      setToken(token)

      const { email, permissions, roles } = responseProfile.data

      setUser({
        email,
        roles,
        permissions,
      })

      Router.push('/')

      authChannel.postMessage('signIn')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated: !!user,
        user,
        closeModal,
        modalIsOpen,
        signInWithGoogle,
        signInModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
