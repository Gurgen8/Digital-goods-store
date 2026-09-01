import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Product } from "@repo/shared"
import { createOrder, getProducts } from "../../api/shopApi"
import Button from "../../components/Button/Button"
import Chip from "../../components/Chip/Chip"
import Container from "../../components/Container/Container"
import SkeletonGrid from "../../components/Feedback/SkeletonGrid"
import Footer from "../../components/Footer/Footer"
import Header from "../../components/Header/Header"
import HeroCarousel from "../../components/HeroCarousel/HeroCarousel"

import ProductGrid from "../../components/ProductGrid/ProductGrid"
import Reviews from "../../components/Reviews/Reviews"
import ServiceIcons from "../../components/ServiceIcons/ServiceIcons"
import SteamTopUp from "../../components/SteamTopUp/SteamTopUp"
import { filterIcons } from "../../assets/filters"
import styles from "./HomePage.module.css"

export default function HomePage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | undefined>(undefined)

  useEffect(() => {
    let active = true
    setError(null)
    setProducts(null)
    getProducts()
      .then((p) => {
        if (!active) return
        setProducts(p)
      })
      .catch((e: unknown) => {
        if (!active) return
        setError(e instanceof Error ? e.message : "Something went wrong")
      })
    return () => {
      active = false
    }
  }, [])

  const chips = useMemo(
    () => [
      { label: "Донат", icon: <img src={filterIcons.donate} alt="" /> },
      { label: "Подписки", icon: <img src={filterIcons.subscribes} alt="" /> },
      { label: "Предметы", icon: <img src={filterIcons.items} alt="" /> },
      { label: "Аккаунты", icon: <img src={filterIcons.accounts} alt="" /> },
      { label: "Ключи", icon: <img src={filterIcons.keys} alt="" /> },
      { label: "Игровая валюта", icon: <img src={filterIcons.game_valut} alt="" /> },
      { label: "Другое", icon: <img src={filterIcons.other} alt="" /> }
    ],
    []
  )

  const onBuy = async (productId: string) => {
    try {
      setBusyId(productId)
      const { orderId } = await createOrder(productId)
      navigate(`/checkout/${orderId}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setBusyId(undefined)
    }
  }

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
          <h2 className={styles.sectionTitle}>Популярные товары</h2>
          <div className={styles.chips} aria-label="Фильтры">
            {chips.map((c, i) => (
              <Chip key={c.label} icon={c.icon} active={i === 0}>
                {c.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className={styles.state}>
          {error ? (
            <div className={styles.errorBox} role="alert">
              <div className={styles.errorTitle}>Something went wrong</div>
              <div className={styles.errorMsg}>{error}</div>
              <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : null}

          {!error && !products ? <SkeletonGrid /> : null}

          {!error && products && products.length === 0 ? (
            <div className={styles.errorBox}>No products</div>
          ) : null}

          {!error && products && products.length > 0 ? (
            <ProductGrid products={products.slice(0, 4)} onBuy={onBuy} busyId={busyId} />
          ) : null}
        </div>

        <div className={styles.sectionHeaderRow}>
          <h2 className={styles.sectionTitle}>Рекомендованные товары</h2>
          <button className={styles.showAllBtn}>Показать все</button>
        </div>
        
        <div className={styles.state}>
          {!error && !products ? <SkeletonGrid /> : null}
          {!error && products && products.length > 0 ? (
            <ProductGrid products={products.slice(0, 4)} onBuy={onBuy} busyId={busyId} />
          ) : null}
        </div>

        <div className={styles.sectionHeaderRow}>
          <h2 className={styles.sectionTitle}>Другие товары</h2>
          <button className={styles.showAllBtn}>Показать все</button>
        </div>
        
        <div className={styles.state}>
          {!error && !products ? <SkeletonGrid /> : null}
          {!error && products && products.length > 0 ? (
            <ProductGrid products={products.slice(0, 4)} onBuy={onBuy} busyId={busyId} />
          ) : null}
        </div>

        <Reviews />
      </Container>

      <Footer />
    </div>
  )
}

