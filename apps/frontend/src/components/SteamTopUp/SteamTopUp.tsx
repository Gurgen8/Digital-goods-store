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
            width={48}
            height={48}
          />
          <div className={styles.brandInfo}>
            <div className={styles.brandRow}>
              <span className={styles.brandName}>Пополнение Steam</span>
              <span className={styles.badge}>5%</span>
            </div>
            <button className={styles.promoBtn} type="button">
              Ввести промокод
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 2 }}>
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* 2 — Login field */}
        <div className={styles.loginBlock}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.fieldIcon}>
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
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
              <circle cx="12" cy="12" r="10" fill="#9aa1ae" />
              <path d="M12 7v2M12 11v6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 3 — Amount and Currency */}
        <div className={styles.amountContainer}>
          <div className={styles.amountIconWrapper}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
               <circle cx="12" cy="12" r="12" fill="#9aa1ae" />
               <path d="M11 7V17H13V13H14C15.6569 13 17 11.6569 17 10C17 8.34315 15.6569 7 14 7H11ZM13 9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H13V9Z" fill="#fff" />
            </svg>
          </div>
          
          <div className={styles.amountDetails}>
            <span className={styles.amountLabel}>Сумма</span>
            <div className={styles.amountInputRow}>
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
          </div>

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
        </div>

        {/* 4 — Pay button */}
        <button className={styles.payBtn} type="button">
          Оплатить {amount || "0"}{currency}
        </button>

      </div>
    </section>
  )
}
