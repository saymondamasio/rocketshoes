import { createContext, ReactNode, useState } from 'react'
import { api } from '../services/api'
import { Product } from '../types'

interface CartProviderProps {
  children: ReactNode
}

interface UpdateProductAmount {
  productId: number
  amount: number
}

interface CartContextData {
  cart: Product[]
  addProduct: (productId: number) => Promise<void>
  removeProduct: (productId: number) => void
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void
}

export const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storeyedCart = localStorage.getItem('@RocketShoes:cart')

    if (storeyedCart) {
      return JSON.parse(storeyedCart)
    }

    return []
  })

  const addProduct = async (productId: number) => {
    try {
      const productExist = cart.find(product => product.id === productId)

      const currentAmount = productExist ? productExist.amount : 0

      const responseStock = await api.get(`stock/${productId}`)

      const haveStock = responseStock.data.amount >= currentAmount + 1

      if (!haveStock) {
        // toast.error('Quantidade solicitada fora de estoque')
        return
      }

      if (productExist) {
        const newCart = cart.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              amount: product.amount + 1,
            }
          }

          return product
        })

        setCart(newCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      } else {
        const productResponse = await api.get(`products/${productId}`)
        const productApi = productResponse.data

        const newCart = [
          ...cart,
          {
            ...productApi,
            amount: 1,
          },
        ]

        setCart(newCart)
        localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      }
    } catch {
      // toast.error('Erro na adição do produto')
    }
  }

  const removeProduct = (productId: number) => {
    try {
      const productIndex = cart.findIndex(product => product.id === productId)
      const newCart = [...cart]
      if (productIndex >= 0) {
        newCart.splice(productIndex, 1)
      } else {
        throw new Error('')
      }

      setCart(newCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
    } catch {
      // toast.error('Erro na remoção do produto')
    }
  }

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) {
        return
      }

      const newCart = [...cart]
      const productExists = newCart.find(product => product.id === productId)

      if (!productExists) {
        throw new Error()
      }

      const stockResponse = await api.get(`/stock/${productId}`)
      const haveStock = stockResponse.data.amount >= amount

      if (!haveStock) {
        // toast.error('Quantidade solicitada fora de estoque')
        return
      }

      productExists.amount = amount

      setCart(newCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
    } catch {
      // toast.error('Erro na alteração de quantidade do produto')
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  )
}
