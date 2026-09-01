type IconName =
  | "search"
  | "heart"
  | "user"
  | "grid"
  | "chevronLeft"
  | "chevronRight"
  | "star"
  | "bolt"

export default function Icon({
  name,
  size = 20,
  title
}: {
  name: IconName
  size?: number
  title?: string
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  } as const

  if (name === "search") {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="2">
        {title ? <title>{title}</title> : null}
        <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
      </svg>
    )
  }

  if (name === "heart") {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="2">
        {title ? <title>{title}</title> : null}
        <path
          d="M12 21s-7-4.6-9.2-8.7C1 9.2 3 6 6.6 6c2 0 3.4 1.2 4.4 2.5C12 7.2 13.4 6 15.4 6 19 6 21 9.2 21.2 12.3 19 16.4 12 21 12 21Z"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === "user") {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="2">
        {title ? <title>{title}</title> : null}
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
        <path
          d="M4 21a8 8 0 0 1 16 0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === "grid") {
    return (
      <svg {...common} fill="currentColor" viewBox="0 0 24 24">
        {title ? <title>{title}</title> : null}
        <path d="M7 11h4V7H7v4Zm6 0h4V7h-4v4ZM7 17h4v-4H7v4Zm6 0h4v-4h-4v4Z" />
      </svg>
    )
  }

  if (name === "chevronLeft") {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="2">
        {title ? <title>{title}</title> : null}
        <path
          d="M15 18 9 12l6-6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === "chevronRight") {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="2">
        {title ? <title>{title}</title> : null}
        <path
          d="M9 6l6 6-6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (name === "star") {
    return (
      <svg {...common} fill="currentColor" viewBox="0 0 24 24">
        {title ? <title>{title}</title> : null}
        <path d="M12 17.3 6.18 20.6l1.12-6.54L2.6 9.4l6.56-.95L12 2.5l2.84 5.95 6.56.95-4.7 4.66 1.12 6.54L12 17.3Z" />
      </svg>
    )
  }

  return (
    <svg {...common} stroke="currentColor" strokeWidth="2">
      {title ? <title>{title}</title> : null}
      <path
        d="M13 2 6 14h7l-1 8 7-12h-7l1-8Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}
