import { useMemo } from "react"
import ReviewCard from "./ReviewCard"
import styles from "./Reviews.module.css"

export default function Reviews() {
  const reviews = useMemo(
    () => [
      {
        avatarUrl: "https://i.pravatar.cc/96?img=12",
        name: "Bizidin",
        rating: 5.0,
        timeLabel: "Сегодня в 11:48",
        text: "Отзывчивый и приятный продавец, помог не только с товаром но и с другим вопросом. Рекомендую!",
        productTitle: "🌸 FunTime | Полностью готовый сервер под ключ ⚡",
        productImageUrl: "https://i.pravatar.cc/96?img=50",
        priceRub: 139
      },
      {
        avatarUrl: "https://i.pravatar.cc/96?img=12",
        name: "Bizidin",
        rating: 5.0,
        timeLabel: "Сегодня в 11:48",
        text: "Отзывчивый и приятный продавец, помог не только с товаром но и с другим вопросом. Рекомендую!",
        productTitle: "🌸 FunTime | Полностью готовый сервер под ключ ⚡",
        productImageUrl: "https://i.pravatar.cc/96?img=50",
        priceRub: 139
      },
      {
        avatarUrl: "https://i.pravatar.cc/96?img=12",
        name: "Bizidin",
        rating: 5.0,
        timeLabel: "Сегодня в 11:48",
        text: "Отзывчивый и приятный продавец, помог не только с товаром но и с другим вопросом. Рекомендую!",
        productTitle: "🌸 FunTime | Полностью готовый сервер под ключ ⚡",
        productImageUrl: "https://i.pravatar.cc/96?img=50",
        priceRub: 139
      }
    ],
    []
  )

  return (
    <section className={styles.section} aria-label="Последние отзывы">
      <div className={styles.titleRow}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>Последние отзывы</h2>
          <p className={styles.subtitle}>Все отзывы взяты с независимой площадки</p>
        </div>
        <button className={styles.showAllBtn} type="button">
          Показать все
        </button>
      </div>
      <div className={styles.grid}>
        {reviews.map((r, i) => (
          <ReviewCard key={i} {...r} />
        ))}
      </div>
    </section>
  )
}
