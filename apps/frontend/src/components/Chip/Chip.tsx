import type { ReactNode } from "react"
import { memo } from "react"
import styles from "./Chip.module.css"

type Props = {
  icon?: ReactNode
  active?: boolean
  children: ReactNode
}

export default memo(function Chip({ icon, active, children }: Props) {
  return (
    <button type="button" className={`${styles.chip} ${active ? styles.active : ""}`} aria-pressed={active}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  )
})
