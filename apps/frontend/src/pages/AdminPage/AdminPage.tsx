import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import type { Order } from "@repo/shared"
import { getRecoveryOrders, retryDelivery } from "src/api/shopApi"
import Button from "src/components/Button/Button"
import Container from "src/components/Container/Container"
import Spinner from "src/components/Spinner/Spinner"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import styles from "./AdminPage.module.css"
import Icon from "src/components/Icon/Icon"

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    setError(null)
    return getRecoveryOrders()
      .then((list) => setOrders(list))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Something went wrong")
      )
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.getItem("isAdmin") !== "true") {
      navigate("/?login=true", { replace: true })
      return
    }
    void load()
  }, [navigate])

  const retry = async (id: string) => {
    try {
      setBusyId(id)
      await retryDelivery(id)
      await load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
      setTimeout(() => setError(null), 6000)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <Container>
        <div className={styles.wrap}>
          <div className={styles.card}>
            <h1 className={styles.title}>Восстановление заказов</h1>

            {error ? (
              <div role="alert" className={styles.errorAlert}>
                <Icon name="info" size={18} />
                <span>{error}</span>
              </div>
            ) : null}

            {!orders && !error ? <Spinner /> : null}

            {orders && orders.length === 0 ? (
              <div className={styles.muted}>Нет заказов для восстановления</div>
            ) : null}

            {orders && orders.length > 0 ? (
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>Заказ</th>
                    <th className={styles.th}>Продукт</th>
                    <th className={styles.th}>Статус</th>
                    <th className={styles.th}>Создан</th>
                    <th className={styles.th}>Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className={styles.tr}>
                      <td className={styles.td}>
                        <Link to={`/orders/${o.id}`}>{o.id}</Link>
                      </td>
                      <td className={styles.td}>{o.product.title}</td>
                      <td className={styles.td}>
                        <span className={styles.status}>{o.status}</span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.muted}>
                          {new Date(o.createdAt).toLocaleString()}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actions}>
                          <Button
                            type="button"
                            onClick={() => retry(o.id)}
                            disabled={busyId === o.id}
                          >
                            Повторить доставку
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  )
}

