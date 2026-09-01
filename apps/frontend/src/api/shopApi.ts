import type { MoneyCurrency, Order, Product } from "@repo/shared"
import { requestJson } from "./client"

export const getProducts = () => requestJson<Product[]>("/api/products")

export const createOrder = (productId: string) =>
  requestJson<{ orderId: string }>("/api/orders", {
    method: "POST",
    body: JSON.stringify({ productId })
  })

export const getOrder = (id: string) => requestJson<Order>(`/api/orders/${id}`)

export const payOrder = (
  id: string,
  payload: { result: "success" | "failed"; currency?: MoneyCurrency }
) =>
  requestJson<{ ok: true }>(`/api/orders/${id}/pay`, {
    method: "POST",
    body: JSON.stringify(payload)
  })

export const getRecoveryOrders = () =>
  requestJson<Order[]>("/api/admin/recovery-orders")

export const retryDelivery = (id: string) =>
  requestJson<{ ok: true }>(`/api/admin/orders/${id}/retry-delivery`, {
    method: "POST",
    body: JSON.stringify({})
  })

