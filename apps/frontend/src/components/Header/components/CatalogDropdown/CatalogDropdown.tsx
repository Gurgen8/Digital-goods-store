import { useState, useEffect } from "react"
import Icon from "src/components/Icon/Icon"
import styles from "./CatalogDropdown.module.css"

type Props = {
  open: boolean
  anchorId: string
  onClose: () => void
}

type CatalogItem = {
  title: string
  items: string[]
}

type CatalogCategory = {
  id: string
  label: string
  columns: CatalogItem[][]
}

const catalogData: CatalogCategory[] = [
  {
    id: "games_and_services",
    label: "Игры и игровые сервисы",
    columns: [
      [
        {
          title: "Steam",
          items: ["Игры и DLC", "Пополнение баланса", "Подарочные карты", "Коллекционные карточки", "Смена региона"]
        },
        {
          title: "Подборки",
          items: ["Скидки 90%", "Популярные издатели", "Лучшие серии игр", "Steam Deck", "Bundle-наборы"]
        }
      ],
      [
        {
          title: "PlayStation",
          items: ["Игры и DLC", "Пополнение баланса", "Новые аккаунты", "PS Plus", "EA Play"]
        }
      ],
      [
        {
          title: "Xbox",
          items: ["Игры и DLC", "Пополнение баланса", "Новые аккаунты", "Xbox Game Pass", "Услуги"]
        }
      ],
      [
        {
          title: "Nintendo",
          items: ["Игры и DLC", "Подарочные карты", "Новые аккаунты", "NS Online"]
        }
      ],
      [
        {
          title: "Battle.net",
          items: ["World of Warcraft", "Подарочные карты", "Прямое пополнение", "Новые аккаунты", "Смена региона"]
        }
      ]
    ]
  },
  { id: "game_values", label: "Игровые ценности", columns: [] },
  { id: "mobile_games", label: "Мобильные игры", columns: [] },
  { id: "services", label: "Сервисы и соцсети", columns: [] },
  { id: "software", label: "Программы", columns: [] }
]

export default function CatalogDropdown({ open, anchorId, onClose }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(catalogData[0].id)

  // Reset to first category when opened
  useEffect(() => {
    if (open) {
      setActiveCategoryId(catalogData[0].id)
    }
  }, [open])

  const activeCategory = catalogData.find(c => c.id === activeCategoryId) || catalogData[0]

  const cn = [styles.panel, open ? styles.open : undefined]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={cn}
      role="menu"
      aria-hidden={!open}
      aria-labelledby={anchorId}
    >
      <div className={styles.sidebar}>
        {catalogData.map(category => (
          <button
            key={category.id}
            type="button"
            className={`${styles.sidebarItem} ${activeCategoryId === category.id ? styles.sidebarItemActive : ""}`}
            onMouseEnter={() => setActiveCategoryId(category.id)}
            onClick={() => setActiveCategoryId(category.id)}
          >
            {category.label}
            <Icon name="chevronRight" size={16} />
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeCategory.columns && activeCategory.columns.length > 0 ? (
          <div className={styles.columns}>
            {activeCategory.columns.map((col, colIdx) => (
              <div key={colIdx} className={styles.column}>
                {col.map((group, groupIdx) => (
                  <div key={groupIdx} className={styles.group}>
                    <button type="button" className={styles.groupTitle} onClick={onClose}>
                      {group.title} <Icon name="chevronRight" size={16} />
                    </button>
                    <div className={styles.groupItems}>
                      {group.items.map((item, itemIdx) => (
                        <a key={itemIdx} href="#" className={styles.groupLink} onClick={onClose}>
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyContent}>В этой категории пока ничего нет.</div>
        )}
      </div>
    </div>
  )
}
