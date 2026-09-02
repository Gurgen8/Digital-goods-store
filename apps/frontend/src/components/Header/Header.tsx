import { useEffect, useId, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Container from "src/components/Container/Container"
import CatalogDropdown from "./components/CatalogDropdown/CatalogDropdown"
import Icon from "src/components/Icon/Icon"
import LoginModal from "src/components/LoginModal/LoginModal"
import styles from "./Header.module.css"


export default function Header() {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const catalogButtonId = useId()
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  const isAdmin = location.pathname.startsWith("/admin")

  useEffect(() => {
    if (location.search.includes("login=true")) {
      setIsLoginOpen(true)
      navigate(location.pathname, { replace: true })
    }
  }, [location.search, location.pathname, navigate])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setIsCatalogOpen(false)
    }

    const onPointerDown = (e: PointerEvent) => {
      const el = wrapRef.current
      if (!el) return
      if (el.contains(e.target as Node)) return
      setIsCatalogOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("pointerdown", onPointerDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("pointerdown", onPointerDown)
    }
  }, [])

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.row} ref={wrapRef}>

          {/* Catalog button */}
          <div className={styles.catalogWrap}>
            <button
              id={catalogButtonId}
              className={styles.catalogButton}
              type="button"
              aria-haspopup={!isAdmin ? "menu" : undefined}
              aria-expanded={!isAdmin ? isCatalogOpen : undefined}
              onClick={() => {
                if (isAdmin) {
                  navigate("/")
                } else {
                  setIsCatalogOpen((v: boolean) => !v)
                }
              }}
            >
              {!isAdmin && <Icon name="catalog" />}
              <span className={styles.catalogButtonText}>{isAdmin ? "Главная" : "Каталог"}</span>
            </button>

            {!isAdmin && (
              <CatalogDropdown
                open={isCatalogOpen}
                anchorId={catalogButtonId}
                onClose={() => setIsCatalogOpen(false)}
              />
            )}
          </div>

          {/* Search — all one unit: input + heart + button inside border */}
          <div className={styles.searchWrap} role="search">
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Игра, приложение или услуга..."
              aria-label="Поиск"
            />
            <button
              className={styles.favoriteButton}
              type="button"
              aria-label="Избранное"
            >
              <Icon name="heart" size={18} />
            </button>
            <button
              className={styles.searchButton}
              type="button"
              aria-label="Искать"
            >
              <Icon name="search" />
            </button>
          </div>

          {/* Profile */}
          <button
            className={styles.profileButton}
            type="button"
            aria-label="Профиль"
            onClick={() => {
              if (!location.pathname.startsWith("/admin")) {
                setIsLoginOpen(true)
              }
            }}
          >
            <Icon name="user" />
          </button>

        </div>
      </Container>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  )
}
