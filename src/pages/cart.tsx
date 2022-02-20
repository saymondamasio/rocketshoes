import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import {
  MdAddCircleOutline,
  MdDelete,
  MdRemoveCircleOutline,
} from 'react-icons/md'
import { useCart } from '../hooks/useCart'
import {
  Container,
  ProductTable,
  Shipping,
  Total,
} from '../styles/pages/cart.styles'
import { CartItem } from '../types'
import { formatPrice } from '../utils/format'

const Cart: NextPage = () => {
  const router = useRouter()

  const {
    cart,
    removeProduct,
    updateProductAmount,
    calculateShipping,
    shipping,
    zipCode,
    setZipCode,
  } = useCart()

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

  async function handleCalculateShipping() {
    calculateShipping(zipCode)
  }

  return (
    <Container>
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
        <div>
          <Shipping>
            {cart.length > 0 && (
              <>
                <input
                  type="text"
                  name="cep"
                  placeholder="CEP"
                  onChange={e => setZipCode(e.target.value)}
                  value={zipCode}
                />
                <button type="button" onClick={handleCalculateShipping}>
                  Calcular
                </button>
              </>
            )}
          </Shipping>

          <Total>
            {shipping.cost && cart.length > 0 ? (
              <div>
                <span>Frete</span>
                <strong>{shipping.costFormatted}</strong>
              </div>
            ) : (
              <></>
            )}
            <div>
              <span>TOTAL</span>
              <strong className="price">{total}</strong>
            </div>
          </Total>
        </div>
        <button type="button" onClick={() => router.push('order')}>
          Finalizar pedido
        </button>
      </footer>
    </Container>
  )
}

export default Cart
