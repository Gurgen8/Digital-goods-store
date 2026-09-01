import { memo } from "react"
import Icon from "src/components/Icon/Icon"
import styles from "./ReviewCard.module.css"

type Props = {
  avatarUrl: string
  name: string
  rating: number
  timeLabel: string
  text: string
  productTitle: string
  productImageUrl: string
  priceRub: number
}

export default memo(function ReviewCard({
  avatarUrl,
  name,
  rating,
  timeLabel,
  text,
  productTitle,
  productImageUrl,
  priceRub
}: Props) {
  return (
    <article className={styles.card}>
      {/* Header: avatar + name/stars on left, time on right */}
      <div className={styles.header}>
        <div className={styles.who}>
          <img className={styles.avatar} src={avatarUrl} alt={name} loading="lazy" />
          <div>
            <div className={styles.name}>{name}</div>
            <div className={styles.ratingRow} aria-label={`Рейтинг ${rating}`}>
              <span className={styles.stars} aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    <Icon name="star" size={14} />
                  </span>
                ))}
              </span>
              <span className={styles.ratingNum}>{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <span className={styles.time}>{timeLabel}</span>
      </div>

      {/* Text bubble */}
      <div className={styles.bubble}>{text}</div>

      {/* Product row */}
      <div className={styles.productRow}>
        <div className={styles.productInfo}>
          <img
            className={styles.productThumb}
            src={productImageUrl}
            alt={productTitle}
            loading="lazy"
          />
          <div className={styles.productTitle}>{productTitle}</div>
        </div>

        <div className={styles.pricePill}>
          <span>{priceRub}₽</span>
        </div>
      </div>
    </article>
  )
})
