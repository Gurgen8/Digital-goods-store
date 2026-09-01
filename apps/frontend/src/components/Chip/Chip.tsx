import type { ReactNode } from "react"
import styles from "./Chip.module.css"

export default function Chip({
  icon,
  children,
  onClick
}: {
  icon?: ReactNode
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button type="button" className={styles.chip} onClick={onClick}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}

