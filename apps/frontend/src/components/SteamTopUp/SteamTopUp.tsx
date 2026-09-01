import type { ChangeEvent } from "react"
import { useMemo, useState } from "react"
import type { MoneyCurrency } from "@repo/shared"
import { brandIconSrc } from "../../assets/brands"
import styles from "./SteamTopUp.module.css"

export default function SteamTopUp() {
  const currencies = useMemo<MoneyCurrency[]>(() => ["$", "₸", "₽"], [])
  const [currency, setCurrency] = useState<MoneyCurrency>("$")
  const [amount, setAmount] = useState("500")
  const [login, setLogin] = useState("")

  return (
    <section className={styles.section} aria-label="Пополнение Steam">
      <div className={styles.card}>

        {/* 1 — Brand block */}
        <div className={styles.brandBlock}>
          <img
            className={styles.brandIcon}
            src={brandIconSrc.steam}
            alt="Steam"
            width={40}
            height={40}
          />
          <div className={styles.brandInfo}>
            <div className={styles.brandRow}>
              <span className={styles.brandName}>Пополнение Steam</span>
              <span className={styles.badge}>5%</span>
            </div>
            <button className={styles.promoBtn} type="button">
              Ввести промокод
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="#6e7682" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.sep} />

        {/* 2 — Login field */}
        <div className={styles.loginBlock}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.fieldIcon}>
            <path d="M8.10027 10.6352C8.2008 10.6318 8.30137 10.63 8.40196 10.6297L10.6744 10.629C11.1284 10.629 11.7251 10.6126 12.167 10.6562C13.2557 10.77 14.2721 11.2545 15.0459 12.0285C15.9385 12.9159 16.4451 14.1195 16.4558 15.3781C16.4562 16.2597 16.0235 16.9954 15.263 17.4307C14.6614 17.7751 14.0977 17.7177 13.4317 17.7178L11.9184 17.7176L7.60251 17.718L6.41592 17.7185C6.09653 17.7186 5.7073 17.7314 5.39874 17.6716C4.99782 17.595 4.62467 17.4126 4.31797 17.1433C3.86187 16.7439 3.58417 16.1789 3.54657 15.5738C3.47145 14.4078 3.96667 13.1025 4.74129 12.2417C5.64183 11.2412 6.77047 10.7208 8.10027 10.6352Z" fill="#9aa1ae" />
            <path d="M9.77204 1.8806C11.9544 1.75576 13.8249 3.42327 13.9506 5.6056C14.0762 7.78792 12.4094 9.65908 10.2271 9.78547C8.04372 9.91194 6.17141 8.24406 6.04572 6.06064C5.92003 3.87723 7.58857 2.00552 9.77204 1.8806Z" fill="#9aa1ae" />
          </svg>
          <input
            className={styles.loginInput}
            type="text"
            placeholder="Логин Steam"
            value={login}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
            aria-label="Логин Steam"
          />
          <button className={styles.infoBtn} type="button" aria-label="Информация">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#9aa1ae" strokeWidth="2" />
              <path d="M12 8v1M12 12v4" stroke="#9aa1ae" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.sep} />

        {/* 3 — Amount */}
        <div className={styles.amountBlock}>
          <img
            className={styles.amountIcon}
            src={brandIconSrc.steam}
            alt=""
            width={24}
            height={24}
          />
          <span className={styles.amountLabel}>Сумма</span>
          <input
            className={styles.amountInput}
            inputMode="numeric"
            value={amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value.replace(/[^\d]/g, ""))
            }
            aria-label="Сумма пополнения"
          />
          <span className={styles.amountCur}>₽</span>
        </div>

        {/* 4 — Currency segmented */}
        <div className={styles.segmented} aria-label="Валюта">
          {currencies.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.segBtn} ${c === currency ? styles.segBtnActive : ""}`}
              aria-pressed={c === currency}
              onClick={() => setCurrency(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 5 — Pay button */}
        <button className={styles.payBtn} type="button">
          Оплатить {amount || "0"}{currency}
        </button>

      </div>
    </section>
  )
}
