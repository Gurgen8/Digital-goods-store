import type { ReactNode } from "react"
import styles from "./Chip.module.css"

export default function Chip({
  icon,
  children,
  onClick,
  active = false
}: {
  icon?: ReactNode
  children: ReactNode
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button 
      type="button" 
      className={`${styles.chip} ${active ? styles.active : ""}`} 
      onClick={onClick}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span>{children}</span>
    </button>
  )
}
