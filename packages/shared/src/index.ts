export type MoneyCurrency = "$" | "₸" | "₽"

export type OrderStatus =
  | "created"
  | "paid"
  | "delivering"
  | "delivered"
  | "out_of_stock"
  | "delivery_failed"
  | "payment_failed"

export type Product = {
  id: string
  title: string
  subtitle?: string
  priceRub: number
  oldPriceRub?: number
  imageUrl: string
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
  deliveryCode?: string
}

export type ApiError = {
  message: string
  code?: string
}
