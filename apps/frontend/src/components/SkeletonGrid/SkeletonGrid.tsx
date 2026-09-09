import styles from "./SkeletonGrid.module.css"

export default function SkeletonGrid() {
  return (
    <div className={styles.cardGrid} aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={`${styles.media} ${styles.skeleton}`} />
          <div className={styles.body}>
            <div>
              <div className={`${styles.title} ${styles.skeleton}`} />
              <div className={`${styles.subtitle} ${styles.skeleton}`} />
            </div>

            <div className={styles.priceRow}>
              <div className={`${styles.price} ${styles.skeleton}`} />
            </div>

            <div className={styles.buy}>
              <div className={`${styles.button} ${styles.skeleton}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
