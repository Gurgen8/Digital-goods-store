import { useEffect, useMemo, useState } from "react"
import Icon from "src/components/Icon/Icon"
import styles from "./HeroCarousel.module.css"


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

        <div className={styles.navGroup}>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Предыдущий слайд"
            onClick={() => setIndex((v: number) => (v - 1 + slides.length) % slides.length)}
          >
            <Icon name="arrowLeft" />
          </button>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Следующий слайд"
            onClick={() => setIndex((v: number) => (v + 1) % slides.length)}
          >
            <Icon name="arrowRight" />
          </button>
        </div>

        <div className={styles.inner}>
          <div className={styles.content}>
            <h1 className={styles.title}>{slide.title}</h1>
            <p className={styles.subtitle}>{slide.subtitle}</p>
            <a className={styles.cta} href="#catalog">
              {slide.cta}
              <Icon name="arrowRight" />
            </a>
          </div>
          <div className={styles.visual} aria-hidden="true" />
        </div>

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
