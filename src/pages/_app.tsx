import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { CartProvider } from '../contexts/CartContext'
import GlobalStyle from '../styles/global'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Component {...pageProps} />
        <GlobalStyle />
        <ToastContainer autoClose={3000} />
      </CartProvider>
    </SessionProvider>
  )
}

export default MyApp
