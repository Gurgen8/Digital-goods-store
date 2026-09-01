import { memo } from "react"
import type { Product } from "@repo/shared"
import ProductCard from "src/components/ProductCard/ProductCard"
import styles from "./ProductGrid.module.css"

export default memo(function ProductGrid({
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
})
