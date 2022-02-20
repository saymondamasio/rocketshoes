import { createContext, ReactNode } from 'react'
import { toast } from 'react-toastify'
import { v4 } from 'uuid'
import { usePersistedState } from '../hooks/usePersistedState'
import { api } from '../services/api-client'
import { CartItem } from '../types'
import { formatPrice } from '../utils/format'

interface CartProviderProps {
  children: ReactNode
}

interface UpdateProductAmount {
  productId: number
  amount: number
}

interface Address {
  zipCode: string
  street: string
  number: string
  complement?: string
  city: string
  state: string
}

interface Shipping {
  zip_code: string
  cost: number
  deadline: Date
  costFormatted: string
  address?: Address
}

interface Order {
  id?: string
  cart: CartItem[]
  shipping: Shipping
}

interface CartContextData {
  cart: CartItem[]
  order: Order
  zipCode: string
  shipping: Shipping
  addProduct: (productId: number) => Promise<void>
  removeProduct: (productId: number) => void
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void
  calculateShipping: (zipCode: string) => Promise<void>
  setZipCode: (zipCode: string) => void
  addShippingAddress: (address: Address) => void
  createOrder: () => Promise<void>
}

export const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = usePersistedState<CartItem[]>('@RocketShoes:cart', [])
  const [shipping, setShipping] = usePersistedState<Shipping>(
    '@RocketShoes:shipping',
    {} as Shipping
  )
  const [order, setOrder] = usePersistedState<Order>(
    '@RocketShoes:order',
    {} as Order
  )
  const [zipCode, setZipCode] = usePersistedState<string>(
    '@RocketShoes:zipCode',
    ''
  )

  const addProduct = async (productId: number) => {
    try {
      const cartItemExist = cart.find(
        cartItem => cartItem.product.id === productId
      )

      const currentQuantity = cartItemExist ? cartItemExist.quantity : 0

      const responseStock = await api.get(`/products/${productId}/stock`)

      const haveStock = responseStock.data.stock >= currentQuantity + 1

      if (!haveStock) {
        toast.error('Quantidade solicitada fora de estoque')
        return
      }

      if (cartItemExist) {
        const newCart = cart.map(cartItem => {
          if (cartItem.product.id === productId) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            }
          }

          return cartItem
        })

        setCart(newCart)
      } else {
        const productResponse = await api.get(`/products/${productId}`)
        const productApi = productResponse.data
        console.log(productApi)

        const newCart = [
          ...cart,
          {
            id: v4(),
            product: productApi,
            quantity: 1,
          },
        ]

        setCart(newCart)
      }
    } catch {
      toast.error('Erro na adição do produto')
    }
  }

  const removeProduct = (productId: number) => {
    try {
      const cartItemIndex = cart.findIndex(
        cartItem => cartItem.product.id === productId
      )
      const newCart = [...cart]
      if (cartItemIndex >= 0) {
        newCart.splice(cartItemIndex, 1)
      } else {
        throw new Error('')
      }

      setCart(newCart)
    } catch {
      toast.error('Erro na remoção do produto')
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
      const cartItemExists = newCart.find(
        carItem => carItem.product.id === productId
      )

      if (!cartItemExists) {
        throw new Error()
      }

      const stockResponse = await api.get(`/products/${productId}/stock`)
      const haveStock = stockResponse.data.stock >= amount

      if (!haveStock) {
        toast.error('Quantidade solicitada fora de estoque')
        return
      }

      cartItemExists.quantity = amount

      setCart(newCart)
    } catch {
      toast.error('Erro na alteração de quantidade do produto')
    }
  }

  const calculateShipping = async () => {
    try {
      const cartParsed = cart.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      }))

      const response = await api.post<any[] | any>('/shipments/calculate/', {
        zip_code: zipCode,
        cart: cartParsed,
      })

      if (response.data.error) {
        toast.error(response.data.error)
        return
      }

      if (Array.isArray(response.data) && response.data.length > 0) {
        const optionShipping = response.data.find(
          option => option.type === 'PAC'
        )

        setShipping({
          zip_code: zipCode,
          cost: optionShipping.cost,
          deadline: new Date(optionShipping.deadline),
          costFormatted: formatPrice(optionShipping.cost / 100),
        })
      }
    } catch {
      toast.error('Erro na busca de entrega')
    }
  }

  const addShippingAddress = (address: Address) => {
    setShipping({
      ...shipping,
      address,
    })
  }

  const createOrder = async () => {
    const orderApi = await api.post('/orders', {
      cart: cart.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity,
      })),
      shipping: {
        address: shipping.address,
        deadline: shipping.deadline,
        cost: shipping.cost,
        type: 'PAC',
      },
      payment: {
        amount:
          cart.reduce((accumulator, cartItem) => {
            const productSubtotal = cartItem.product.price * cartItem.quantity
            return accumulator + productSubtotal
          }, 0) + shipping.cost,
      },
    })
    console.log(orderApi)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addProduct,
        removeProduct,
        updateProductAmount,
        shipping,
        calculateShipping,
        zipCode,
        setZipCode,
        addShippingAddress,
        createOrder,
        order,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
