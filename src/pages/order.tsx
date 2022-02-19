import { NextPage } from 'next'
import React from 'react'
import {
  MdAddCircleOutline,
  MdDelete,
  MdRemoveCircleOutline,
} from 'react-icons/md'
import { useCart } from '../hooks/useCart'
import {
  Container,
  ContainerInfoCart,
  ProductTable,
  Total,
} from '../styles/pages/order.styles'
import { CartItem } from '../types'
import { formatPrice } from '../utils/format'

const Order: NextPage = () => {
  const { cart, removeProduct, updateProductAmount } = useCart()

  const cartFormatted = cart.map(cartItem => ({
    ...cartItem,
    subTotal: formatPrice(cartItem.product.price * cartItem.quantity),
    product: {
      ...cartItem.product,
      priceFormatted: formatPrice(cartItem.product.price),
    },
  }))
  const total = formatPrice(
    cart.reduce((sumTotal, cartItem) => {
      sumTotal += cartItem.product.price * cartItem.quantity
      return sumTotal
    }, 0)
  )

  function handleCartItemIncrement(cartItem: CartItem) {
    updateProductAmount({
      productId: cartItem.product.id,
      amount: cartItem.quantity + 1,
    })
  }

  function handleCartItemDecrement(cartItem: CartItem) {
    updateProductAmount({
      productId: cartItem.product.id,
      amount: cartItem.quantity - 1,
    })
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId)
  }

  return (
    <Container>
      <ContainerInfoCart>
        <ProductTable>
          <thead>
            <tr>
              <th aria-label="product image" />
              <th>PRODUTO</th>
              <th>QTD</th>
              <th>SUBTOTAL</th>
              <th aria-label="delete icon" />
            </tr>
          </thead>
          <tbody>
            {cartFormatted.map(cartItem => (
              <tr data-testid="product" key={cartItem.product.id}>
                <td>
                  <img
                    src={cartItem.product.photos_url[0]}
                    alt={cartItem.product.title}
                  />
                </td>
                <td>
                  <strong>{cartItem.product.title}</strong>
                  <span>{cartItem.product.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={cartItem.quantity <= 1}
                      onClick={() => handleCartItemDecrement(cartItem)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={cartItem.quantity}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleCartItemIncrement(cartItem)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{cartItem.subTotal}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(cartItem.product.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </ProductTable>

        <footer>
          <Total>
            <span>TOTAL</span>
            <strong>{total}</strong>
          </Total>
        </footer>
      </ContainerInfoCart>
    </Container>
  )
}

export default Order
