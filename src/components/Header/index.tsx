import Link from 'next/link'
import React from 'react'
import { FiUser } from 'react-icons/fi'
import { MdShoppingBasket } from 'react-icons/md'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { Cart, Container } from './styles'

export const Header = (): JSX.Element => {
  const { cart } = useCart()
  const { signInModal } = useAuth()
  const cartSize = cart.length

  return (
    <Container>
      <Link href="/" passHref>
        <a>
          <img src="assets/logo.svg" alt="Rocketshoes" />
        </a>
      </Link>

      <div>
        <Link href="/cart" passHref>
          <Cart>
            <div>
              <strong>Meu carrinho</strong>
              <span data-testid="cart-size">
                {cartSize === 1 ? `${cartSize} item` : `${cartSize} itens`}
              </span>
            </div>
            <MdShoppingBasket size={36} color="#FFF" />
          </Cart>
        </Link>
        <button onClick={signInModal}>
          <FiUser size={35} color="#FFF" />
        </button>
      </div>
    </Container>
  )
}
