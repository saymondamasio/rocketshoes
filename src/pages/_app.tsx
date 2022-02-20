import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { Header } from '../components/Header'
import { ModalLogin } from '../components/Modal/ModalLogin'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import GlobalStyle from '../styles/global'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <Component {...pageProps} />
        <GlobalStyle />
        <ModalLogin />
        <ToastContainer autoClose={3000} />
      </CartProvider>
    </AuthProvider>
  )
}

export default MyApp
