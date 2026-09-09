import { memo, useEffect, useState } from "react"
import type { Product } from "@repo/shared"
import Button from "src/components/Button/Button"
import styles from "./ProductCard.module.css"

export default memo(function ProductCard({
  product,
  onBuy,
  busy
}: {
  product: Product
  onBuy: (productId: string) => void
  busy?: boolean
}) {
  const [hasActiveOrder, setHasActiveOrder] = useState(false)

  useEffect(() => {
    const checkActiveOrder = () => {
      const storageKey = `active_order_${product.id}`
      const storedStr = localStorage.getItem(storageKey)
      if (storedStr) {
        try {
          const stored = JSON.parse(storedStr)
          if (stored.orderId && stored.expiresAt) {
            const expires = new Date(stored.expiresAt).getTime()
            if (expires > Date.now()) {
              setHasActiveOrder(true)
              return
            } else {
              // Timer has expired, clean up local storage
              localStorage.removeItem(storageKey)
            }
          }
        } catch (e) {}
      }
      setHasActiveOrder(false)
    }

    checkActiveOrder()
    const intervalId = setInterval(checkActiveOrder, 1000)
    window.addEventListener("focus", checkActiveOrder)
    return () => {
      clearInterval(intervalId)
      window.removeEventListener("focus", checkActiveOrder)
    }
  }, [product.id])

  const isDisabled = busy || (!hasActiveOrder && product.stock === 0)
  const buttonText = hasActiveOrder 
    ? "Вернуться к оплате" 
    : (product.stock === 0 ? "Нет в наличии" : "Купить")

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img
          className={styles.image}
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <div>
          <h3 className={styles.title}>{product.title}</h3>
          {product.subtitle ? (
            <p className={styles.subtitle}>{product.subtitle}</p>
          ) : null}
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{product.priceRub} ₽</span>
          {product.oldPriceRub ? (
            <span className={styles.oldPrice}>{product.oldPriceRub} ₽</span>
          ) : null}
        </div>

        <div className={styles.buy}>
          <Button
            type="button"
            fullWidth
            disabled={isDisabled}
            onClick={() => onBuy(product.id)}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </article>
  )
})