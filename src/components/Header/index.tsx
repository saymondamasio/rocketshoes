import Link from 'next/link'
import React from 'react'
import { MdShoppingBasket } from 'react-icons/md'
import { useCart } from '../../hooks/useCart'
import { Cart, Container } from './styles'

export const Header = (): JSX.Element => {
  const { cart } = useCart()
  const cartSize = cart.length

  return (
    <Container>
      <Link href="/" passHref>
        <a>
          <img src="assets/logo.svg" alt="Rocketshoes" />
        </a>
      </Link>

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
    </Container>
  )
}
