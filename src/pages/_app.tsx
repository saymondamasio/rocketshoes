import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { Header } from '../components/Header'
import { CartProvider } from '../contexts/CartContext'
import GlobalStyle from '../styles/global'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    // <SessionProvider session={session}>
    <CartProvider>
      <Header />
      <Component {...pageProps} />
      <GlobalStyle />
      <ToastContainer autoClose={3000} />
    </CartProvider>
    // </SessionProvider>
  )
}

export default MyApp
