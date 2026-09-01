import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import type { MoneyCurrency, Order } from "@repo/shared"
import { getOrder, payOrder } from "src/api/shopApi"
import Button from "src/components/Button/Button"
import Container from "src/components/Container/Container"
import Spinner from "src/components/Spinner/Spinner"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import styles from "./CheckoutPage.module.css"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const currencies = useMemo<MoneyCurrency[]>(() => ["$", "₸", "₽"], [])
  const [currency, setCurrency] = useState<MoneyCurrency>("$")

  useEffect(() => {
    if (!orderId) return
    let active = true
    setError(null)
    setOrder(null)
    getOrder(orderId)
      .then((o) => {
        if (!active) return
        setOrder(o)
      })
      .catch((e: unknown) => {
        if (!active) return
        setError(e instanceof Error ? e.message : "Something went wrong")
      })
    return () => {
      active = false
    }
  }, [orderId])

  const pay = async (result: "success" | "failed") => {
    if (!orderId) return
    try {
      setBusy(true)
      await payOrder(orderId, { result, currency })
      navigate(`/orders/${orderId}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <Container>
        <div className={styles.content}>
          <div className={styles.card}>
            <h1 className={styles.title}>Checkout</h1>

            {!order && !error ? <Spinner /> : null}

            {error ? (
              <div role="alert">
                <div className={styles.hint}>{error}</div>
              </div>
            ) : null}

            {order ? (
              <>
                <div className={styles.productRow}>
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

                <div className={styles.price}>{order.product.priceRub} ₽</div>
                <div className={styles.hint}>Order status: {order.status}</div>

                {order.status === "created" ? (
                  <div className={styles.actions}>
                    <div className={styles.hint}>Mock payment:</div>
                    <div className={styles.actions}>
                      <div className={styles.hint}>Валюта</div>
                      <div>
                        {currencies.map((c) => (
                          <Button
                            key={c}
                            type="button"
                            variant={c === currency ? "primary" : "secondary"}
                            onClick={() => setCurrency(c)}
                          >
                            {c}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button type="button" onClick={() => pay("success")} disabled={busy}>
                      Pay success
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => pay("failed")}
                      disabled={busy}
                    >
                      Pay failed
                    </Button>
                  </div>
                ) : (
                  <div className={styles.actions}>
                    <Link to={`/orders/${order.id}`}>Go to order</Link>
                  </div>
                )}
              </>
            ) : null}
          </div>

          <div className={styles.card}>
            <div className={styles.hint}>
              После успешной оплаты backend переводит заказ в paid → delivering →
              delivered / out_of_stock / delivery_failed.
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  )
}

