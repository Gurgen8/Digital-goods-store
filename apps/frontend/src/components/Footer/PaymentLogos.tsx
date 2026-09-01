export function VisaLogo({ height = 20 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 120 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VISA"
    >
      <rect width="120" height="40" rx="10" fill="#FFFFFF" />
      <path
        d="M20 30 12 10h7l3.8 12.2L26.7 10h6.8L24.9 30h-4.9ZM36.1 10h6.3L37 30h-6.3L36.1 10ZM60.2 15.2c-1.3-.6-3.2-1.2-5.6-1.2-2.7 0-4.4 1-4.4 2.4 0 1.2 1.5 1.9 4 2.9 3 1.1 7.1 2.6 7.1 7 0 4.6-4.1 7.2-10.7 7.2-3 0-6-.6-8.1-1.6l1-5c2 .9 4.7 1.7 7.4 1.7 2.4 0 4.7-.7 4.7-2.6 0-1.2-1.1-2.1-4.5-3.3-2.8-1-6.6-2.5-6.6-6.6 0-4.4 4.1-7 10.2-7 2.7 0 5.1.5 6.8 1.2l-1.3 4.9ZM78.6 10h5l7.7 20h-6.5l-1-2.9h-7.4L75.4 30h-6.4l9.6-20Zm-1.1 12.8h4.7l-2.3-6.7-2.4 6.7Z"
        fill="#1A1F71"
      />
    </svg>
  )
}

export function MirLogo({ height = 20 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 120 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="МИР"
    >
      <rect width="120" height="40" rx="10" fill="#FFFFFF" />
      <path
        d="M18 30V10h6.2l6 10.7L36.2 10H42v20h-6v-9.8l-5.6 9.8h-.4l-5.6-9.8V30H18ZM48.5 30V10h6.3v7.6H62V10h6.3v20H62v-7.6h-7.2V30h-6.3ZM74.2 30V10h9.7c5.7 0 9.2 3 9.2 7.7 0 3.1-1.6 5.6-4.4 6.8l4.9 5.5h-7.6l-4-4.7h-1.5V30h-6.3Zm6.3-9.4h2.9c2.2 0 3.4-1 3.4-2.7S85.6 15 83.4 15h-2.9v5.6Z"
        fill="#00A19B"
      />
      <path
        d="M48.5 10h6.3v20h-6.3V10Z"
        fill="#F57C00"
        opacity="0.0"
      />
    </svg>
  )
}

export function MastercardLogo({ height = 20 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 120 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mastercard"
    >
      <rect width="120" height="40" rx="10" fill="#FFFFFF" />
      <circle cx="54" cy="20" r="10" fill="#EB001B" />
      <circle cx="66" cy="20" r="10" fill="#F79E1B" />
      <path
        d="M60 12.5c2.5 1.8 4 4.5 4 7.5s-1.5 5.7-4 7.5c-2.5-1.8-4-4.5-4-7.5s1.5-5.7 4-7.5Z"
        fill="#FF5F00"
      />
      <path
        d="M28 28.5V11.5h3.7l4.1 9.1 4.1-9.1h3.7v17h-2.6V16l-3.7 8.3h-3L30.6 16v12.5H28ZM86 28.5V11.5h7c3.9 0 6.4 2 6.4 5.3 0 3.3-2.4 5.3-6.4 5.3h-4.3v6.4H86Zm2.7-8.8h4.1c2.3 0 3.7-1.1 3.7-2.9 0-1.8-1.4-2.9-3.7-2.9h-4.1v5.8Z"
        fill="#111827"
        opacity="0.75"
      />
    </svg>
  )
}

