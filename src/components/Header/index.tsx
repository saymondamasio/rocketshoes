import Link from 'next/link'
import React from 'react'
import { MdShoppingBasket } from 'react-icons/md'
import logo from '../../assets/images/logo.svg'
import { useCart } from '../../hooks/useCart'
import { Cart, Container } from './styles'

export const Header = (): JSX.Element => {
  const { cart } = useCart()
  const cartSize = cart.length

  return (
    <Container>
      <Link href="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart href="/cart">
        <a>
          <div>
            <strong>Meu carrinho</strong>
            <span data-testid="cart-size">
              {cartSize === 1 ? `${cartSize} item` : `${cartSize} itens`}
            </span>
          </div>
          <MdShoppingBasket size={36} color="#FFF" />
        </a>
      </Cart>
    </Container>
  )
}
