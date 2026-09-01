import { useMemo } from "react"
import Icon from "../../../Icon/Icon"
import styles from "./CatalogDropdown.module.css"

type Props = {
  open: boolean
  anchorId: string
  onClose: () => void
}

export default function CatalogDropdown({ open, anchorId, onClose }: Props) {
  const items = useMemo(
    () => [
      { label: "Steam", hint: "Ключи, игры, валюта" },
      { label: "Telegram", hint: "Подписки и сервисы" },
      { label: "Roblox", hint: "Gift cards и Robux" },
      { label: "PlayStation", hint: "Подписки и игры" },
      { label: "TikTok", hint: "Coins и пополнение" }
    ],
    []
  )

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
      <h3 className={styles.title}>Категории</h3>
      <div className={styles.list}>
        {items.map((it: { label: string; hint: string }) => (
          <button
            key={it.label}
            type="button"
            className={styles.item}
            role="menuitem"
            onClick={onClose}
          >
            <span className={styles.itemText}>
              <span className={styles.itemLabel}>{it.label}</span>
              <span className={styles.itemHint}>{it.hint}</span>
            </span>
            <Icon name="chevronRight" size={18} title="Открыть" />
          </button>
        ))}
      </div>
    </div>
  )
}
