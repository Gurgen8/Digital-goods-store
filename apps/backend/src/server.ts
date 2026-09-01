import cors from "cors"
import express from "express"
import { z } from "zod"
import type { ApiError, MoneyCurrency, Order } from "@repo/shared"
import { products } from "./data/products.js"
import {
  applyDeliveryOutcome,
  computeInitialDeliveryOutcome,
  computeRetryOutcome,
  createOrder,
  incrementDeliveryAttempt,
  markDelivering,
  markPaid,
  markPaymentFailed,
  type InternalOrder
} from "./logic/orderMachine.js"

const port = Number(process.env.BACKEND_PORT ?? 3001)

const app = express()
app.use(cors())
app.use(express.json({ limit: "256kb" }))

const sendError = (
  res: express.Response,
  status: number,
  message: string,
  code?: string
) => {
  const payload: ApiError = { message, code }
  res.status(status).json(payload)
}

const orders = new Map<string, InternalOrder>()

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const scheduleDelivery = async (orderId: string, attempt: number) => {
  await sleep(700)
  const current = orders.get(orderId)
  if (!current || current.status !== "paid") return
  orders.set(orderId, markDelivering(current))

  await sleep(900)
  const delivering = orders.get(orderId)
  if (!delivering || delivering.status !== "delivering") return

  const outcome =
    attempt <= 1
      ? computeInitialDeliveryOutcome(orderId)
      : computeRetryOutcome(orderId, attempt)
  orders.set(orderId, applyDeliveryOutcome(delivering, outcome))
}

app.get("/api/health", (_req: express.Request, res: express.Response) => {
  res.json({ ok: true })
})

app.get("/api/products", (_req: express.Request, res: express.Response) => {
  res.json(products)
})

app.post("/api/orders", async (req: express.Request, res: express.Response) => {
  const schema = z.object({
    productId: z.string().min(1)
  })

  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return sendError(res, 422, "Invalid request", "invalid_request")
  }

  const product = products.find((p) => p.id === parsed.data.productId)
  if (!product) return sendError(res, 404, "Product not found", "not_found")

  const order = createOrder(product)
  orders.set(order.id, order)
  res.status(201).json({ orderId: order.id })
})

app.get("/api/orders/:id", (req: express.Request, res: express.Response) => {
  const order = orders.get(req.params.id)
  if (!order) return sendError(res, 404, "Order not found", "not_found")
  const publicOrder: Order = order
  res.json(publicOrder)
})

app.post(
  "/api/orders/:id/pay",
  async (req: express.Request, res: express.Response) => {
    const schema = z.object({
      result: z.enum(["success", "failed"]),
      currency: z.custom<MoneyCurrency>().optional()
    })

    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return sendError(res, 422, "Invalid request", "invalid_request")
    }

    const current = orders.get(req.params.id)
    if (!current) return sendError(res, 404, "Order not found", "not_found")

    if (current.status !== "created") {
      return sendError(res, 409, "Order payment already processed", "conflict")
    }

    if (parsed.data.result === "failed") {
      orders.set(current.id, markPaymentFailed(current))
      return res.json({ ok: true })
    }

    const paid = markPaid(current)
    const attempt = paid.deliveryAttempts + 1
    orders.set(paid.id, incrementDeliveryAttempt(paid))
    void scheduleDelivery(paid.id, attempt)

    res.json({ ok: true })
  }
)

app.get(
  "/api/admin/recovery-orders",
  (_req: express.Request, res: express.Response) => {
    const list = Array.from(orders.values()).filter(
      (o) => o.status === "out_of_stock" || o.status === "delivery_failed"
    )
    res.json(list satisfies Order[])
  }
)

app.post(
  "/api/admin/orders/:id/retry-delivery",
  async (req: express.Request, res: express.Response) => {
    const current = orders.get(req.params.id)
    if (!current) return sendError(res, 404, "Order not found", "not_found")

    if (current.status !== "out_of_stock" && current.status !== "delivery_failed") {
      return sendError(res, 409, "Order is not recoverable", "conflict")
    }

    const paid = {
      ...current,
      status: "paid",
      updatedAt: new Date().toISOString()
    } satisfies InternalOrder

    const bumped = incrementDeliveryAttempt(paid)
    const attempt = bumped.deliveryAttempts
    orders.set(bumped.id, bumped)
    void scheduleDelivery(bumped.id, attempt)

    res.json({ ok: true })
  }
)

app.use((_req: express.Request, res: express.Response) => {
  sendError(res, 404, "Not found", "not_found")
})

app.listen(port, () => {
  console.log(`[backend] listening on http://localhost:${port}`)
})
