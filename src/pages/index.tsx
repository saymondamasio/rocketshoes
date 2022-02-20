import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import { MdAddShoppingCart } from 'react-icons/md'
import { useCart } from '../hooks/useCart'
import { api } from '../services/api-client'
import { ProductList } from '../styles/pages/home.styles'
import { Product } from '../types'
import { formatPrice } from '../utils/format'

interface ProductFormatted extends Product {
  priceFormatted: string
}

interface CartItemsAmount {
  [key: string]: number
}

const Home: NextPage = () => {
  const [products, setProducts] = useState<ProductFormatted[]>([])

  const { addProduct, cart } = useCart()

  const cartItemsAmount = cart.reduce((sumAmount, cartItem) => {
    sumAmount[cartItem.product.id] = cartItem.quantity

    return sumAmount
  }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get<Product[]>('products')

      const products = response.data.map<ProductFormatted>(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }))

      setProducts(products)
    }

    loadProducts()
  }, [])

  async function handleAddProduct(id: number) {
    await addProduct(id)
  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.photos_url[0]} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  )
}

export default Home
