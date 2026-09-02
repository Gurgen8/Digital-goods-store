import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import type { Order, OrderStatus } from "@repo/shared"
import { getOrder } from "src/api/shopApi"
import Button from "src/components/Button/Button"
import Container from "src/components/Container/Container"
import Spinner from "src/components/Spinner/Spinner"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import LoginModal from "src/components/LoginModal/LoginModal"
import styles from "./OrderPage.module.css"

const labelForStatus = (s: OrderStatus) => {
  if (s === "created") return "создан • ожидается оплата"
  if (s === "paid") return "оплачен • подготовка доставки"
  if (s === "delivering") return "доставляется • в процессе"
  if (s === "delivered") return "доставлен • успешно"
  if (s === "out_of_stock") return "нет в наличии • требуется восстановление"
  if (s === "delivery_failed") return "ошибка доставки • требуется восстановление"
  return "ошибка оплаты • не удалась"
}

export default function OrderPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

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
            <h1 className={styles.title}>Заказ</h1>
            {!order && !error ? <Spinner /> : null}

            {error ? (
              <div role="alert">
                <div>{error}</div>
                <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
                  Повторить
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
                  <div>ID заказа: {order.id}</div>
                  <div>Цена: {order.product.priceRub} ₽</div>
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
                      Оплата завершена. Доставка временно недоступна. Заказ будет повторен.
                    </div>
                    <div>
                      <a className={styles.link} href="#" onClick={(e) => { e.preventDefault(); setIsLoginOpen(true); }}>
                        Открыть админку восстановления
                      </a>
                    </div>
                  </div>
                ) : null}

                {order.status === "payment_failed" ? (
                  <div className={styles.meta}>
                    <div>Оплата не удалась. Пожалуйста, создайте новый заказ.</div>
                    <div>
                      <Link to="/">На главную</Link>
                    </div>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          <div className={styles.card}>
            <div className={styles.meta}>
              <div>
                Backend автоматически имитирует доставку. Страница опрашивает статус до конечного состояния.
              </div>
              {order && !isTerminal ? <div>Загрузка…</div> : null}
            </div>
          </div>
        </div>
      </Container>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  )
}

