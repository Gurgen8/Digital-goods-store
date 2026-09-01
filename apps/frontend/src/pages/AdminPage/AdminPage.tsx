import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { Order } from "@repo/shared"
import { getRecoveryOrders, retryDelivery } from "src/api/shopApi"
import Button from "src/components/Button/Button"
import Container from "src/components/Container/Container"
import Spinner from "src/components/Feedback/components/Spinner/Spinner"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import styles from "./AdminPage.module.css"

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

  useEffect(() => {
    void load()
  }, [])

  const retry = async (id: string) => {
    try {
      setBusyId(id)
      await retryDelivery(id)
      await load()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
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
            <h1 className={styles.title}>Recovery Orders</h1>

            {error ? (
              <div role="alert" className={styles.muted}>
                {error}
              </div>
            ) : null}

            {!orders && !error ? <Spinner /> : null}

            {orders && orders.length === 0 ? (
              <div className={styles.muted}>No recovery orders</div>
            ) : null}

            {orders && orders.length > 0 ? (
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th className={styles.th}>Order</th>
                    <th className={styles.th}>Product</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Created</th>
                    <th className={styles.th}>Action</th>
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
                            Retry delivery
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

