import type { ChangeEvent } from "react"
import { useMemo, useState } from "react"
import type { MoneyCurrency } from "@repo/shared"
import styles from "./SteamTopUp.module.css"
import { brandIconSrc } from "src/assets/brands"
import Icon from "src/components/Icon/Icon"
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
              <Icon name="chevronDown" size={10} style={{ marginLeft: 2 }} />
            </button>
          </div>
        </div>

        {/* 2 — Login field */}
        <div className={styles.loginBlock}>
          <Icon name="account" size={20} className={styles.fieldIcon} />
          <input
            className={styles.loginInput}
            type="text"
            placeholder="Логин Steam"
            value={login}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
            aria-label="Логин Steam"
          />
          <button className={styles.infoBtn} type="button" aria-label="Информация">
            <Icon name="info" size={16} />
          </button>
        </div>

        {/* 3 — Amount and Currency */}
        <div className={styles.amountContainer}>
          <div className={styles.amountIconWrapper}>
            <Icon name="ruble" size={20} />
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
