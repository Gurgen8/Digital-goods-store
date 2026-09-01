import { useEffect, useMemo, useState } from "react"
import styles from "./HeroCarousel.module.css"

// ── Arrow icons from Desktop SVGs ──────────────────────────────────────────

function ArrowLeft() {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.48047 7.00391C3.42318 7.0612 3.35872 7.10417 3.28711 7.13281C3.21549 7.16146 3.13672 7.17578 3.05078 7.17578C2.9362 7.17578 2.82878 7.14714 2.72852 7.08984C2.62826 7.03255 2.54948 6.96094 2.49219 6.875L0.171875 3.99609C0.114583 3.9388 0.0716146 3.87435 0.0429688 3.80273C0.0143229 3.73112 0 3.65234 0 3.56641C0 3.48047 0.0143229 3.39453 0.0429688 3.30859C0.0716146 3.22266 0.114583 3.15104 0.171875 3.09375L2.49219 0.257812C2.54948 0.171875 2.62826 0.107422 2.72852 0.0644531C2.82878 0.0214844 2.9362 0 3.05078 0C3.2513 0 3.41602 0.0644531 3.54492 0.193359C3.67383 0.322266 3.73828 0.486979 3.73828 0.6875C3.73828 0.773438 3.72396 0.859375 3.69531 0.945312C3.66667 1.03125 3.63802 1.10286 3.60938 1.16016L2.23438 2.83594H10.2695C10.4701 2.83594 10.6419 2.90755 10.7852 3.05078C10.9284 3.19401 11 3.36589 11 3.56641C11 3.76693 10.9284 3.93164 10.7852 4.06055C10.6419 4.18945 10.4701 4.25391 10.2695 4.25391H2.23438L3.60938 5.97266C3.63802 6.05859 3.66667 6.13737 3.69531 6.20898C3.72396 6.2806 3.73828 6.35938 3.73828 6.44531C3.73828 6.5599 3.7168 6.66732 3.67383 6.76758C3.63086 6.86784 3.56641 6.94661 3.48047 7.00391Z" fill="black"/>
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.51953 0.128906C7.57682 0.10026 7.64128 0.0716147 7.71289 0.0429688C7.78451 0.0143228 7.86328 0 7.94922 0C8.0638 0 8.17122 0.0214844 8.27148 0.0644531C8.37175 0.107422 8.45052 0.171875 8.50781 0.257812L10.8281 3.13672C10.8854 3.19401 10.9284 3.26562 10.957 3.35156C10.9857 3.4375 11 3.52344 11 3.60938C11 3.69531 10.9857 3.77409 10.957 3.8457C10.9284 3.91732 10.8854 3.98177 10.8281 4.03906L8.50781 6.875C8.45052 6.96094 8.37175 7.03255 8.27148 7.08984C8.17122 7.14714 8.0638 7.17578 7.94922 7.17578C7.7487 7.17578 7.58398 7.10417 7.45508 6.96094C7.32617 6.81771 7.26172 6.64583 7.26172 6.44531C7.26172 6.35938 7.27604 6.2806 7.30469 6.20898C7.33333 6.13737 7.36198 6.05859 7.39062 5.97266L8.76562 4.29688H0.730469C0.529948 4.29688 0.358073 4.22526 0.214844 4.08203C0.0716146 3.9388 0 3.78125 0 3.60938C0 3.40885 0.0716146 3.23698 0.214844 3.09375C0.358073 2.95052 0.529948 2.87891 0.730469 2.87891H8.76562L7.39062 1.16016C7.36198 1.10286 7.33333 1.03125 7.30469 0.945312C7.27604 0.859375 7.26172 0.773438 7.26172 0.6875C7.26172 0.572917 7.2832 0.472656 7.32617 0.386719C7.36914 0.300781 7.43359 0.214844 7.51953 0.128906Z" fill="black"/>
    </svg>
  )
}

// ── Carousel ───────────────────────────────────────────────────────────────

type Slide = {
  title: string
  subtitle: string
  cta: string
}

export default function HeroCarousel() {
  const slides = useMemo<Slide[]>(
    () => [
      {
        title: "Сервисы и подписки",
        subtitle: "Telegram, PS+, TikTok — удобная оплата в пару кликов.",
        cta: "Открыть каталог"
      },
      {
        title: "Пополняй Steam быстро",
        subtitle: "Покупки, ключи и пополнения — без лишних шагов.",
        cta: "Перейти к пополнению"
      },
      {
        title: "Игры и валюта",
        subtitle: "Подборки, скидки и мгновенная доставка кода после оплаты.",
        cta: "Смотреть предложения"
      }
    ],
    []
  )

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((v: number) => (v + 1) % slides.length)
    }, 4500)
    return () => window.clearInterval(t)
  }, [slides.length])

  const slide = slides[index]

  return (
    <section className={styles.hero} aria-label="Промо баннер">
      <div className={styles.frame}>

        {/* Top-right arrow navigation — matching Figma layout */}
        <div className={styles.navGroup}>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Предыдущий слайд"
            onClick={() => setIndex((v: number) => (v - 1 + slides.length) % slides.length)}
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Следующий слайд"
            onClick={() => setIndex((v: number) => (v + 1) % slides.length)}
          >
            <ArrowRight />
          </button>
        </div>

        {/* Slide content */}
        <div className={styles.inner}>
          <div className={styles.content}>
            <h1 className={styles.title}>{slide.title}</h1>
            <p className={styles.subtitle}>{slide.subtitle}</p>
            <a className={styles.cta} href="#catalog">
              {slide.cta}
              <ArrowRight />
            </a>
          </div>
          <div className={styles.visual} aria-hidden="true" />
        </div>

        {/* Dot indicators at bottom */}
        <div className={styles.dots} role="tablist" aria-label="Слайды">
          {slides.map((_, i: number) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              aria-label={`Слайд ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
