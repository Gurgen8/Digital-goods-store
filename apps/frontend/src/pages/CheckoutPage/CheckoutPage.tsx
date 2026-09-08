import { Link, useParams } from "react-router-dom"
import Button from "src/components/Button/Button"
import Container from "src/components/Container/Container"
import Spinner from "src/components/Spinner/Spinner"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import styles from "./CheckoutPage.module.css"
import { useCheckout, translateStatus } from "./useCheckout"
import { useShopStore } from "src/store/useShopStore"

export default function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const {
    order,
    error,
    busy,
    promoCode,
    promoError,
    promoApplying,
    setPromoCode,
    setPromoError,
    pay,
    applyPromo,
  } = useCheckout(orderId)

  const storeProduct = useShopStore(s => order ? s.getProduct(order.product.id) : undefined)
  const displayAmount = (order?.status === "created" && !order?.promoCodeId && storeProduct)
    ? storeProduct.priceRub
    : order?.amount

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
                    <>{displayAmount ?? order.product.priceRub} ₽</>
                  )}
                </div>
                <div className={styles.hint}>Статус заказа: {translateStatus(order.status)}</div>

                {order.status === "created" ? (
                  <>
                    {storeProduct?.stock === 0 && (
                      <div className={styles.outOfStockWarning}>
                        <span>⚠️</span> Извините, но товара на данный момент нет на складе.
                      </div>
                    )}

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
                            disabled={promoApplying || storeProduct?.stock === 0}
                          />
                          <Button type="submit" disabled={promoApplying || !promoCode.trim() || storeProduct?.stock === 0}>
                            Применить
                          </Button>
                        </form>
                        {promoError && <div className={styles.promoErrorText}>{promoError}</div>}
                      </>
                    )}

                    <div className={styles.actions}>
                      <Button 
                        type="button" 
                        onClick={() => pay("success")} 
                        disabled={busy || storeProduct?.stock === 0}
                      >
                        {storeProduct?.stock === 0 ? "Нет в наличии" : "Оплатить успешно"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => pay("failed")}
                        disabled={busy || storeProduct?.stock === 0}
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

