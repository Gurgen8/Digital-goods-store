import type { ButtonHTMLAttributes } from "react"
import styles from "./Button.module.css"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
  fullWidth?: boolean
}

export default function Button({
  variant = "primary",
  fullWidth,
  className,
  ...rest
}: Props) {
  const cn = [
    styles.button,
    variant === "primary" ? styles.primary : styles.secondary,
    fullWidth ? styles.fullWidth : undefined,
    className
  ]
    .filter(Boolean)
    .join(" ")

  return <button className={cn} {...rest} />
}

