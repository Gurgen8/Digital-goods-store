import type { Product } from "@repo/shared"
import ProductCard from "../ProductCard/ProductCard"
import styles from "./ProductGrid.module.css"

export default function ProductGrid({
  products,
  onBuy,
  busyId
}: {
  products: Product[]
  onBuy: (productId: string) => void
  busyId?: string
}) {
  return (
    <section id="catalog" className={styles.section} aria-label="Каталог">
      <div className={styles.titleRow}>
        <h2 className={styles.title}>Каталог</h2>
      </div>

      <div className={styles.grid}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onBuy={onBuy}
            busy={busyId === p.id}
          />
        ))}
      </div>
    </section>
  )
}

