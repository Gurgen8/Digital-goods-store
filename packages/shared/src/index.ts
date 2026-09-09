export type MoneyCurrency = "$" | "₸" | "₽"

export type OrderStatus =
  | "created"
  | "paid"
  | "delivering"
  | "delivered"
  | "out_of_stock"
  | "delivery_failed"
  | "payment_failed"
  | "expired"

export type Product = {
  id: string
  title: string
  subtitle?: string
  category?: string
  priceRub: number
  oldPriceRub?: number
  imageUrl: string
  stock: number
}

export type Order = {
  id: string
  product: Product
  status: OrderStatus
  amount: number
  originalAmount?: number
  promoCodeId?: string
  createdAt: string
  updatedAt: string
  expiresAt?: string
  deliveryCode?: string
}

export type ApiError = {
  message: string
  code?: string
}
