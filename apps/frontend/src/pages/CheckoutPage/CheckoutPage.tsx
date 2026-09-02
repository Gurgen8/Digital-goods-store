import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import type { Order } from "@repo/shared"
import { getOrder, payOrder, applyPromoCode } from "src/api/shopApi"
import Button from "src/components/Button/Button"
import Container from "src/components/Container/Container"
import Spinner from "src/components/Spinner/Spinner"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import styles from "./CheckoutPage.module.css"

const errorMap: Record<string, string> = {
  "Invalid promo code": "Неверный промокод",
  "Promo code limit reached": "Лимит использования промокода исчерпан",
  "Order not found": "Заказ не найден",
  "Order cannot be modified": "Заказ не может быть изменен",
  "Promo code already applied": "Промокод уже применен",
  "Product not found": "Товар не найден",
  "Something went wrong": "Что-то пошло не так"
}
const translateError = (msg: string) => errorMap[msg] || msg

const statusMap: Record<string, string> = {
  created: "Создан",
  paid: "Оплачен",
  delivering: "Доставляется",
  delivered: "Выполнен",
  out_of_stock: "Нет в наличии",
  delivery_failed: "Ошибка доставки",
  payment_failed: "Ошибка оплаты",
}
const translateStatus = (status: string) => statusMap[status] || status

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState<string | null>(null)
  const [promoApplying, setPromoApplying] = useState(false)

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
        setError(translateError(e instanceof Error ? e.message : "Something went wrong"))
      })
    return () => {
      active = false
    }
  }, [orderId])

  const pay = async (result: "success" | "failed") => {
    if (!orderId) return
    try {
      setBusy(true)
      await payOrder(orderId, { result, currency: "$" })
      navigate(`/orders/${orderId}`)
    } catch (e: unknown) {
      setError(translateError(e instanceof Error ? e.message : "Something went wrong"))
    } finally {
      setBusy(false)
    }
  }

  const applyPromo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId || !promoCode.trim()) return
    try {
      setPromoApplying(true)
      setPromoError(null)
      const res = await applyPromoCode(orderId, promoCode.trim())
      if (res.ok && order) {
        setOrder({ ...order, amount: res.newAmount, promoCodeId: "applied" })
        setPromoCode("")
      }
    } catch (e: unknown) {
      setPromoError(translateError(e instanceof Error ? e.message : "Something went wrong"))
    } finally {
      setPromoApplying(false)
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <Container>
        <div className={styles.content}>
          <div className={styles.card}>
            <h1 className={styles.title}>Оплата</h1>

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

                <div className={styles.price}>
                  {order.originalAmount != null && order.amount !== order.originalAmount ? (
                    <>
                      <span className={styles.originalPrice}>{order.originalAmount} ₽</span>{" "}
                      {order.amount} ₽
                    </>
                  ) : (
                    <>{order.amount ?? order.product.priceRub} ₽</>
                  )}
                </div>
                <div className={styles.hint}>Статус заказа: {translateStatus(order.status)}</div>

                {order.status === "created" ? (
                  <>
                    {!order.promoCodeId && (
                      <>
                        <form className={styles.promoForm} onSubmit={applyPromo}>
                          <input
                            type="text"
                            className={`${styles.promoInput} ${promoError ? styles.promoInputError : ''}`}
                            placeholder="Промокод"
                            value={promoCode}
                            onChange={(e) => {
                              setPromoCode(e.target.value)
                              setPromoError(null)
                            }}
                            disabled={promoApplying}
                          />
                          <Button type="submit" disabled={promoApplying || !promoCode.trim()}>
                            Применить
                          </Button>
                        </form>
                        {promoError && <div className={styles.promoErrorText}>{promoError}</div>}
                      </>
                    )}

                    <div className={styles.actions}>
                      <Button type="button" onClick={() => pay("success")} disabled={busy}>
                        Оплатить успешно
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => pay("failed")}
                        disabled={busy}
                      >
                        Ошибка оплаты
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className={styles.actions}>
                    <Link to={`/orders/${order.id}`}>Перейти к заказу</Link>
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

