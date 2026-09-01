import type { Order, OrderStatus, Product } from "@repo/shared"
import { randomUUID } from "node:crypto"

export type InternalOrder = Order & {
  deliveryAttempts: number
}

const nowIso = () => new Date().toISOString()

const makeDeliveryCode = (seed: string) => {
  const clean = seed.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 12)
  const padded = (clean + "XXXXXXXXXXXX").slice(0, 12)
  return `${padded.slice(0, 4)}-${padded.slice(4, 8)}-${padded.slice(8, 12)}`
}

const stableNumber = (id: string) => {
  let n = 0
  for (let i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) >>> 0
  return n
}

export const computeInitialDeliveryOutcome = (
  orderId: string
): Exclude<OrderStatus, "created" | "paid" | "payment_failed"> => {
  const n = stableNumber(orderId) % 10
  if (n === 0) return "out_of_stock"
  if (n === 1 || n === 2) return "delivery_failed"
  return "delivered"
}

export const computeRetryOutcome = (
  orderId: string,
  attempt: number
): Exclude<OrderStatus, "created" | "paid" | "payment_failed"> => {
  if (attempt >= 2) return "delivered"
  const n = (stableNumber(orderId) + attempt * 7) % 10
  if (n === 0) return "out_of_stock"
  if (n === 1) return "delivery_failed"
  return "delivered"
}

export const createOrder = (product: Product): InternalOrder => {
  const t = nowIso()
  return {
    id: randomUUID(),
    product,
    status: "created",
    createdAt: t,
    updatedAt: t,
    deliveryAttempts: 0
  }
}

export const markPaid = (order: InternalOrder): InternalOrder => {
  if (order.status !== "created") throw new Error("Order not in created state")
  return {
    ...order,
    status: "paid",
    updatedAt: nowIso()
  }
}

export const markPaymentFailed = (order: InternalOrder): InternalOrder => {
  if (order.status !== "created") throw new Error("Order not in created state")
  return {
    ...order,
    status: "payment_failed",
    updatedAt: nowIso()
  }
}

export const markDelivering = (order: InternalOrder): InternalOrder => {
  if (order.status !== "paid") throw new Error("Order not in paid state")
  return {
    ...order,
    status: "delivering",
    updatedAt: nowIso()
  }
}

export const applyDeliveryOutcome = (
  order: InternalOrder,
  outcome: Exclude<OrderStatus, "created" | "paid" | "payment_failed">
): InternalOrder => {
  if (order.status !== "delivering") throw new Error("Order not delivering")

  if (outcome === "delivered") {
    const code = makeDeliveryCode(order.id)
    return {
      ...order,
      status: "delivered",
      updatedAt: nowIso(),
      deliveryCode: code
    }
  }

  return {
    ...order,
    status: outcome,
    updatedAt: nowIso()
  }
}

export const incrementDeliveryAttempt = (order: InternalOrder): InternalOrder => {
  return {
    ...order,
    deliveryAttempts: order.deliveryAttempts + 1,
    updatedAt: nowIso()
  }
}

