import { useCallback, useMemo, useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { createOrder } from "src/api/shopApi"
import { useShopStore } from "src/store/useShopStore"
import { v4 as uuidv4 } from "uuid"
import Button from "src/components/Button/Button"
import Chip from "src/components/Chip/Chip"
import Container from "src/components/Container/Container"
import SkeletonGrid from "src/components/SkeletonGrid/SkeletonGrid"
import Footer from "src/components/Footer/Footer"
import Header from "src/components/Header/Header"
import HeroCarousel from "src/components/HeroCarousel/HeroCarousel"
import ProductGrid from "src/components/ProductGrid/ProductGrid"
import Reviews from "src/components/Reviews/Reviews"
import ServiceIcons from "src/components/ServiceIcons/ServiceIcons"
import SteamTopUp from "src/components/SteamTopUp/SteamTopUp"
import { filterIcons } from "src/assets/filters"
import styles from "./HomePage.module.css"

export default function HomePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, error, isLoading, isFetching, init } = useShopStore()
  const [busyId, setBusyId] = useState<string | undefined>(undefined)

  const searchParam = searchParams.get("search") || ""
  const categoryParam = searchParams.get("category") || ""

  useEffect(() => {
    init(searchParam, categoryParam)
  }, [searchParam, categoryParam, init])

  const chips = useMemo(
    () => [
      { id: "donate", label: "Донат", icon: <img src={filterIcons.donate} alt="" loading="lazy" decoding="async" /> },
      { id: "subscribes", label: "Подписки", icon: <img src={filterIcons.subscribes} alt="" loading="lazy" decoding="async" /> },
      { id: "items", label: "Предметы", icon: <img src={filterIcons.items} alt="" loading="lazy" decoding="async" /> },
      { id: "accounts", label: "Аккаунты", icon: <img src={filterIcons.accounts} alt="" loading="lazy" decoding="async" /> },
      { id: "keys", label: "Ключи", icon: <img src={filterIcons.keys} alt="" loading="lazy" decoding="async" /> },
      { id: "game_valut", label: "Игровая валюта", icon: <img src={filterIcons.game_valut} alt="" loading="lazy" decoding="async" /> },
      { id: "other", label: "Другое", icon: <img src={filterIcons.other} alt="" loading="lazy" decoding="async" /> }
    ],
    []
  )

  const toggleCategory = (id: string) => {
    setSearchParams(prev => {
      if (prev.get("category") === id) prev.delete("category")
      else prev.set("category", id)
      return prev
    })
  }

  const onBuy = useCallback(
    async (productId: string) => {
      try {
        setBusyId(productId)

        const storageKey = `active_order_${productId}`
        const storedStr = localStorage.getItem(storageKey)
        if (storedStr) {
          try {
            const stored = JSON.parse(storedStr)
            if (stored.orderId && stored.expiresAt) {
              const expires = new Date(stored.expiresAt).getTime()
              if (expires > Date.now()) {
                navigate(`/checkout/${stored.orderId}`)
                return
              }
            }
          } catch (e) {
          }
        }

        const idempotencyKey = uuidv4()
        const { orderId, expiresAt } = await createOrder(productId, idempotencyKey)
        
        localStorage.setItem(storageKey, JSON.stringify({ orderId, expiresAt }))

        navigate(`/checkout/${orderId}`)
      } catch (e: unknown) {
        console.error(e)
      } finally {
        setBusyId(undefined)
      }
    },
    [navigate]
  )

  const isFiltered = !!searchParam || !!categoryParam

  return (
    <div className={styles.page}>
      <Header />

      <Container>
        <HeroCarousel />
        <div className={styles.servicesCard}>
          <ServiceIcons />
          <SteamTopUp />
        </div>

        <div className={styles.filtersRow}>
          <h2 className={styles.sectionTitle}>Каталог товаров</h2>

          <div className={styles.chips} aria-label="Фильтры">
            {categoryParam && (
              <div onClick={() => toggleCategory(categoryParam)}>
                <Chip active={false}>
                  ✕ Сбросить
                </Chip>
              </div>
            )}
            {chips.map((c) => (
              <div key={c.id} onClick={() => toggleCategory(c.id)}>
                <Chip icon={c.icon} active={categoryParam === c.id}>
                  {c.label}
                </Chip>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.state} style={{ opacity: isFetching ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
          {error ? (
            <div className={styles.errorBox} role="alert">
              <div className={styles.errorTitle}>Something went wrong</div>
              <div className={styles.errorMsg}>{error}</div>
              <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : null}

          {isLoading ? <SkeletonGrid /> : null}

          {!error && !isLoading && products.length === 0 ? (
            <div className={styles.errorBox}>Ничего не найдено по вашему запросу.</div>
          ) : null}

          {products.length > 0 && isFiltered ? (
            <ProductGrid products={products} onBuy={onBuy} busyId={busyId} />
          ) : null}

          {products.length > 0 && !isFiltered ? (
            <>
              <ProductGrid products={products.slice(0, 4)} onBuy={onBuy} busyId={busyId} />

              <div className={styles.sectionHeaderRow} style={{ marginTop: 40 }}>
                <h2 className={styles.sectionTitle}>Рекомендованные товары</h2>
                <button className={styles.showAllBtn}>Показать все</button>
              </div>
              <ProductGrid products={products.slice(4, 8)} onBuy={onBuy} busyId={busyId} />

              <div className={styles.sectionHeaderRow} style={{ marginTop: 40 }}>
                <h2 className={styles.sectionTitle}>Другие товары</h2>
                <button className={styles.showAllBtn}>Показать все</button>
              </div>
              <ProductGrid products={products.slice(8, 12)} onBuy={onBuy} busyId={busyId} />
            </>
          ) : null}
        </div>

        <Reviews />
      </Container>
      <Footer />
    </div>
  )
}
