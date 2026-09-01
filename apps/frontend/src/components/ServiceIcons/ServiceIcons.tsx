import { useMemo } from "react"
import type { BrandName } from "../../assets/brands"
import { brandIconSrc } from "../../assets/brands"
import styles from "./ServiceIcons.module.css"

export default function ServiceIcons() {
  const items = useMemo(
    () => [
      { label: "Steam", icon: "steam" as const },
      { label: "Telegram", icon: "telegram" as const },
      { label: "Roblox", icon: "roblox" as const },
      { label: "Brawl Stars", icon: "brawlstars" as const },
      { label: "PUBG Mobile", icon: "pubg" as const },
      { label: "App Store", icon: "appstore" as const },
      { label: "ChatGPT", icon: "chatgpt" as const },
      { label: "PlayStation", icon: "playstation" as const },
      { label: "TikTok", icon: "tiktok" as const },
      { label: "Mobile Legends", icon: "mobilelegends" as const }
    ],
    []
  )

  return (
    <section className={styles.section} aria-label="Сервисы">
      <div className={styles.titleRow}>
        <h2 className={styles.title}>Сервисы</h2>
      </div>
      <div className={styles.row}>
        {items.map((it: { label: string; icon: BrandName }) => (
          <button key={it.label} className={styles.tile} type="button">
            <img
              className={styles.icon}
              src={brandIconSrc[it.icon]}
              alt={it.label}
              width={64}
              height={64}
              loading="lazy"
            />
            <span className={styles.label}>{it.label}</span>
          </button>
        ))}
        <button className={styles.tile} type="button" aria-label="Ещё">
          <img
            className={styles.icon}
            src={brandIconSrc.more}
            alt=""
            width={64}
            height={64}
            loading="lazy"
          />
          <span className={styles.moreCount}>ещё 841</span>
        </button>
      </div>
    </section>
  )
}
