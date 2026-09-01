import type { Product } from "@repo/shared"
import Button from "../Button/Button"
import styles from "./ProductCard.module.css"

export default function ProductCard({
  product,
  onBuy,
  busy
}: {
  product: Product
  onBuy: (productId: string) => void
  busy?: boolean
}) {
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
            disabled={busy}
            onClick={() => onBuy(product.id)}
          >
            Купить
          </Button>
        </div>
      </div>
    </article>
  )
}

