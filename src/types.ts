export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Product {
  id: number
  title: string
  price: number
  photos_url: string[]
  stock: number
}
