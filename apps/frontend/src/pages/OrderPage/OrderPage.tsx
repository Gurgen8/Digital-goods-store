import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import type { Order, OrderStatus } from "@repo/shared"
import { getOrder } from "src/api/shopApi"
import Button from "src/components/Button/Button"
import Container from "src/components/Container/Container"
import Spinner from "src/components/Spinner/Spinner"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import styles from "./OrderPage.module.css"

const labelForStatus = (s: OrderStatus) => {
  if (s === "created") return "created • payment pending"
  if (s === "paid") return "paid • preparing delivery"
  if (s === "delivering") return "delivering • in progress"
  if (s === "delivered") return "delivered • success"
  if (s === "out_of_stock") return "out_of_stock • recovery required"
  if (s === "delivery_failed") return "delivery_failed • recovery required"
  return "payment_failed • failed"
}

export default function OrderPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isTerminal = useMemo(() => {
    if (!order) return false
    return (
      order.status === "delivered" ||
      order.status === "out_of_stock" ||
      order.status === "delivery_failed" ||
      order.status === "payment_failed"
    )
  }, [order])

  useEffect(() => {
    if (!id) return
    let active = true
    const load = () =>
      getOrder(id)
        .then((o) => {
          if (!active) return
          setOrder(o)
          setError(null)
        })
        .catch((e: unknown) => {
          if (!active) return
          setError(e instanceof Error ? e.message : "Something went wrong")
        })

    void load()

    const t = window.setInterval(() => {
      if (!active) return
      if (isTerminal) return
      void load()
    }, 1200)

    return () => {
      active = false
      window.clearInterval(t)
    }
  }, [id, isTerminal])

  const dotClass = useMemo(() => {
    if (!order) return styles.statusDot
    if (order.status === "delivered") return `${styles.statusDot} ${styles.ok}`
    if (order.status === "payment_failed") return `${styles.statusDot} ${styles.bad}`
    if (order.status === "delivery_failed") return `${styles.statusDot} ${styles.bad}`
    if (order.status === "out_of_stock") return `${styles.statusDot} ${styles.bad}`
    return styles.statusDot
  }, [order])

  return (
    <div className={styles.page}>
      <Header />
      <Container>
        <div className={styles.wrap}>
          <div className={styles.card}>
            <h1 className={styles.title}>Order</h1>
            {!order && !error ? <Spinner /> : null}

            {error ? (
              <div role="alert">
                <div>{error}</div>
                <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : null}

            {order ? (
              <>
                <div className={styles.row}>
                  <img
                    className={styles.thumb}
                    src={order.product.imageUrl}
                    alt={order.product.title}
                  />
                  <div>
                    <div className={styles.pTitle}>{order.product.title}</div>
                    {order.product.subtitle ? (
                      <div className={styles.pSub}>{order.product.subtitle}</div>
                    ) : null}
                  </div>
                </div>

                <div className={styles.meta}>
                  <div>Order ID: {order.id}</div>
                  <div>Price: {order.product.priceRub} ₽</div>
                </div>

                <div className={styles.status}>
                  <span className={dotClass} aria-hidden="true" />
                  <span>{labelForStatus(order.status)}</span>
                </div>

                {order.status === "delivered" && order.deliveryCode ? (
                  <div className={styles.code} aria-label="Delivery code">
                    {order.deliveryCode}
                  </div>
                ) : null}

                {order.status === "out_of_stock" || order.status === "delivery_failed" ? (
                  <div className={styles.meta}>
                    <div>
                      Payment completed. Delivery temporarily unavailable. Your order will be
                      retried.
                    </div>
                    <div>
                      <Link to="/admin">Open admin recovery</Link>
                    </div>
                  </div>
                ) : null}

                {order.status === "payment_failed" ? (
                  <div className={styles.meta}>
                    <div>Payment failed. Please create a new order.</div>
                    <div>
                      <Link to="/">Back to home</Link>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          <div className={styles.card}>
            <div className={styles.meta}>
              <div>
                Backend simulates delivery automatically. Page polls status until terminal state.
              </div>
              {order && !isTerminal ? <div>Loading…</div> : null}
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  )
}

