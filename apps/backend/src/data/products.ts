import type { Product } from "@repo/shared"

const img = (prompt: string) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt
  )}&image_size=landscape_4_3`

export const products: Product[] = [
  {
    id: "doom-2016-steam-key",
    title: "💥 DOOM 2016 💀 STEAM KEY 🔑",
    subtitle: "РФ+СНГ",
    priceRub: 990,
    oldPriceRub: 1990,
    imageUrl: img("modern dark sci fi game cover art, red accent lighting, bold composition")
  },
  {
    id: "pubg-mobile-topup",
    title: "💥 PUBG Mobile UC 🔑",
    subtitle: "Пополнение",
    priceRub: 139,
    oldPriceRub: 199,
    imageUrl: img("mobile shooter game themed cover art, energetic, blue orange lighting")
  },
  {
    id: "roblox-gift-card",
    title: "💥 Roblox Gift Card 🔑",
    subtitle: "Подарочная карта",
    priceRub: 499,
    oldPriceRub: 699,
    imageUrl: img("colorful playful game gift card cover, minimal, high contrast")
  },
  {
    id: "telegram-premium",
    title: "💥 Telegram Premium 🔑",
    subtitle: "Подписка",
    priceRub: 399,
    oldPriceRub: 499,
    imageUrl: img("clean premium subscription card cover, blue white gradient, minimal icons")
  },
  {
    id: "playstation-plus",
    title: "💥 PlayStation Plus 🔑",
    subtitle: "Подписка",
    priceRub: 1290,
    oldPriceRub: 1590,
    imageUrl: img("gaming subscription cover art, dark background, neon blue glow, minimal")
  },
  {
    id: "tiktok-coins",
    title: "💥 TikTok Coins 🔑",
    subtitle: "Пополнение",
    priceRub: 299,
    oldPriceRub: 349,
    imageUrl: img("short video social app themed cover art, black background, neon accents")
  },
  {
    id: "app-store-gift",
    title: "💥 App Store & iTunes 🔑",
    subtitle: "Gift Card",
    priceRub: 999,
    oldPriceRub: 1099,
    imageUrl: img("minimal gift card cover, soft gradient, premium, clean typography")
  },
  {
    id: "chatgpt-plus",
    title: "💥 ChatGPT Plus 🔑",
    subtitle: "Подписка",
    priceRub: 1990,
    oldPriceRub: 2190,
    imageUrl: img("modern AI subscription cover, clean white background, subtle green accent")
  },
  {
    id: "wow-subscription",
    title: "💥 World of Warcraft 🔑",
    subtitle: "Подписка",
    priceRub: 1490,
    oldPriceRub: 1790,
    imageUrl: img("modern dark sci fi game cover art, red accent lighting, bold composition")
  },
  {
    id: "valorant-points",
    title: "💥 Valorant Points 🔑",
    subtitle: "Пополнение",
    priceRub: 590,
    oldPriceRub: 790,
    imageUrl: img("mobile shooter game themed cover art, energetic, blue orange lighting")
  },
  {
    id: "netflix-premium",
    title: "💥 Netflix Premium 🔑",
    subtitle: "Подписка",
    priceRub: 899,
    oldPriceRub: 1099,
    imageUrl: img("colorful playful game gift card cover, minimal, high contrast")
  },
  {
    id: "xbox-game-pass",
    title: "💥 Xbox Game Pass 🔑",
    subtitle: "Подписка",
    priceRub: 1190,
    oldPriceRub: 1490,
    imageUrl: img("gaming subscription cover art, dark background, neon blue glow, minimal")
  }
]
