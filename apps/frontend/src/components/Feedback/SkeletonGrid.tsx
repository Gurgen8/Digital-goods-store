import styles from "./Feedback.module.css"

export default function SkeletonGrid() {
  return (
    <div className={styles.cardGrid} aria-label="Loading products">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  )
}

