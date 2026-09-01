type Brand =
  | "roblox"
  | "brawl"
  | "pubg"
  | "appstore"
  | "chatgpt"
  | "playstation"
  | "tiktok"
  | "mobilelegends"
  | "steam"
  | "telegram"
  | "discord"

export default function BrandIcon({
  name,
  size = 48,
  title
}: {
  name: Brand
  size?: number
  title?: string
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    xmlns: "http://www.w3.org/2000/svg"
  } as const

  if (name === "roblox") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="8" fill="#E52521" />
        <rect
          x="25"
          y="25"
          width="14"
          height="14"
          transform="rotate(15 32 32)"
          fill="#FFFFFF"
          opacity="0.92"
        />
      </svg>
    )
  }

  if (name === "steam") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="14" fill="#0B1C2C" />
        <circle cx="40.5" cy="24.5" r="7.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="40.5" cy="24.5" r="4.2" fill="#0B1C2C" />
        <path
          d="M21 39.5l9.8 4.7c3.1 1.5 6.8.2 8.4-2.9 1.6-3.1.4-6.9-2.7-8.5l-5.6-2.9"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="24" cy="41" r="5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="24" cy="41" r="2.7" fill="#0B1C2C" />
      </svg>
    )
  }

  if (name === "telegram") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="14" fill="#2AABEE" />
        <path
          d="M46.8 21.6 18.7 32.4c-.9.3-.9 1.6 0 2l7.2 2.6 2.8 9.1c.3 1 1.6 1.1 2.1.2l4-6.6 7.2 5.3c.8.6 1.9.1 2.1-.9l4.2-21.1c.2-1-.8-1.8-1.7-1.4Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
      </svg>
    )
  }

  if (name === "discord") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="14" fill="#5865F2" />
        <path
          d="M22 41c3.1 2.3 6.5 3.5 10 3.5S38.9 43.3 42 41c.6-5.8.1-10.6-2.6-16-2.7-1.3-5.1-2-7.4-2.2l-.9 1.5c-2.5.2-4.9.9-7.4 2.2-2.7 5.4-3.2 10.2-2.7 16Z"
          fill="#FFFFFF"
          opacity="0.92"
        />
        <circle cx="27.8" cy="34.2" r="2.3" fill="#5865F2" />
        <circle cx="36.2" cy="34.2" r="2.3" fill="#5865F2" />
      </svg>
    )
  }

  if (name === "appstore") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="14" fill="#0F172A" />
        <path
          d="M28 22.5 18.8 40h5.3l2.1-4h11.6l2.1 4h5.3L34 22.5h-6Z"
          fill="#FFFFFF"
          opacity="0.94"
        />
        <rect x="25" y="30" width="14" height="4" rx="2" fill="#0F172A" />
      </svg>
    )
  }

  if (name === "playstation") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="14" fill="#003791" />
        <path
          d="M30.5 20.5v26.2c5.6-1.7 10.6-4.1 10.6-8.7 0-5.1-4.6-7.5-10.6-9.2v-8.3Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
        <path
          d="M29 24.3c-5.3 1.9-9.8 4.4-9.8 8.8 0 3.9 3.2 6.4 9.8 7.8V24.3Z"
          fill="#FFFFFF"
          opacity="0.85"
        />
      </svg>
    )
  }

  if (name === "tiktok") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="14" fill="#0B0B0B" />
        <path
          d="M38.8 27.6c-2.3-1.4-3.8-3.5-4.2-6.1h-4.3v17.1c0 2.1-1.7 3.8-3.8 3.8s-3.8-1.7-3.8-3.8 1.7-3.8 3.8-3.8c.4 0 .9.1 1.3.2v-4.5c-.4-.1-.9-.1-1.3-.1-4.6 0-8.3 3.7-8.3 8.3S21.9 47 26.5 47s8.3-3.7 8.3-8.3v-8.6c1.3 1 2.8 1.7 4.5 2v-4.5Z"
          fill="#FFFFFF"
          opacity="0.92"
        />
        <path
          d="M33.2 30.1c1.3 1 2.8 1.7 4.5 2"
          stroke="#25F4EE"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M26.6 34.1c-2.1 0-3.8 1.7-3.8 3.8"
          stroke="#FE2C55"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    )
  }

  if (name === "chatgpt") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="14" fill="#0B0B0B" />
        <path
          d="M32 19.5c2.5 0 4.7 1.3 5.9 3.3 2.7.4 4.8 2.7 4.8 5.5 0 2.1-1.1 3.9-2.8 4.9.1.4.1.8.1 1.2 0 3.5-2.8 6.3-6.3 6.3-1 0-2-.2-2.9-.7-1.2 1.2-2.9 2-4.8 2-3.5 0-6.3-2.8-6.3-6.3 0-.3 0-.6.1-.9-1.7-1-2.8-2.8-2.8-4.9 0-2.9 2.2-5.2 5-5.6 1.1-1.9 3.1-3.1 5.3-3.1Z"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
    )
  }

  if (name === "pubg") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="14" fill="#F59E0B" />
        <rect x="18" y="24" width="28" height="16" rx="6" fill="#0B0B0B" />
        <path
          d="M22 33h20"
          stroke="#F59E0B"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  if (name === "brawl") {
    return (
      <svg {...common} fill="none">
        {title ? <title>{title}</title> : null}
        <rect x="10" y="10" width="44" height="44" rx="14" fill="#111827" />
        <circle cx="32" cy="32" r="14" fill="#FBBF24" />
        <path
          d="M26 28h12l-6 12-6-12Z"
          fill="#111827"
          opacity="0.95"
        />
      </svg>
    )
  }

  return (
    <svg {...common} fill="none">
      {title ? <title>{title}</title> : null}
      <rect x="10" y="10" width="44" height="44" rx="14" fill="#111827" />
      <path
        d="M22 40c3.4-8.5 10-17 20-19-1.3 9.6-9.1 17-20 19Z"
        fill="#FFFFFF"
        opacity="0.92"
      />
    </svg>
  )
}

