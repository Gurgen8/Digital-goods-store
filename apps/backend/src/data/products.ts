import type { Product } from "@repo/shared"

const img = (prompt: string, index: number) =>
  `https://picsum.photos/seed/${encodeURIComponent(prompt).substring(0, 10)}${index}/400/300.webp`

export const products: Product[] = [
  {
    id: "doom-2016-steam-key",
    title: "💥 DOOM 2016 💀 STEAM KEY 🔑",
    subtitle: "РФ+СНГ",
    category: "keys",
    priceRub: 990,
    oldPriceRub: 1990,
    stock: 10,
    imageUrl: img("modern dark sci fi game cover art, red accent lighting, bold composition", 0)
  },
  {
    id: "pubg-mobile-topup",
    title: "💥 PUBG Mobile UC 🔑",
    subtitle: "Пополнение",
    category: "game_valut",
    priceRub: 139,
    oldPriceRub: 199,
    stock: 10,
    imageUrl: img("mobile shooter game themed cover art, energetic, blue orange lighting", 1)
  },
  {
    id: "roblox-gift-card",
    title: "💥 Roblox Gift Card 🔑",
    subtitle: "Подарочная карта",
    category: "donate",
    priceRub: 499,
    oldPriceRub: 699,
    stock: 10,
    imageUrl: img("colorful playful game gift card cover, minimal, high contrast", 2)
  },
  {
    id: "telegram-premium",
    title: "💥 Telegram Premium 🔑",
    subtitle: "Подписка",
    category: "subscribes",
    priceRub: 399,
    oldPriceRub: 499,
    stock: 10,
    imageUrl: img("clean premium subscription card cover, blue white gradient, minimal icons", 3)
  },
  {
    id: "playstation-plus",
    title: "💥 PlayStation Plus 🔑",
    subtitle: "Подписка",
    category: "subscribes",
    priceRub: 1290,
    oldPriceRub: 1590,
    stock: 10,
    imageUrl: img("gaming subscription cover art, dark background, neon blue glow, minimal", 4)
  },
  {
    id: "tiktok-coins",
    title: "💥 TikTok Coins 🔑",
    subtitle: "Пополнение",
    category: "donate",
    priceRub: 299,
    oldPriceRub: 349,
    stock: 10,
    imageUrl: img("short video social app themed cover art, black background, neon accents", 5)
  },
  {
    id: "app-store-gift",
    title: "💥 App Store & iTunes 🔑",
    subtitle: "Gift Card",
    category: "other",
    priceRub: 999,
    oldPriceRub: 1099,
    stock: 10,
    imageUrl: img("minimal gift card cover, soft gradient, premium, clean typography", 6)
  },
  {
    id: "chatgpt-plus",
    title: "💥 ChatGPT Plus 🔑",
    subtitle: "Подписка",
    category: "subscribes",
    priceRub: 1990,
    oldPriceRub: 2190,
    stock: 10,
    imageUrl: img("modern AI subscription cover, clean white background, subtle green accent", 7)
  },
  {
    id: "wow-subscription",
    title: "💥 World of Warcraft 🔑",
    subtitle: "Подписка",
    category: "subscribes",
    priceRub: 1490,
    oldPriceRub: 1790,
    stock: 10,
    imageUrl: img("modern dark sci fi game cover art, red accent lighting, bold composition", 8)
  },
  {
    id: "valorant-points",
    title: "💥 Valorant Points 🔑",
    subtitle: "Пополнение",
    category: "game_valut",
    priceRub: 590,
    oldPriceRub: 790,
    stock: 10,
    imageUrl: img("mobile shooter game themed cover art, energetic, blue orange lighting", 9)
  },
  {
    id: "netflix-premium",
    title: "💥 Netflix Premium 🔑",
    subtitle: "Подписка",
    category: "subscribes",
    priceRub: 899,
    oldPriceRub: 1099,
    stock: 10,
    imageUrl: img("colorful playful game gift card cover, minimal, high contrast", 10)
  },
  {
    id: "xbox-game-pass",
    title: "💥 Xbox Game Pass 🔑",
    subtitle: "Подписка",
    category: "subscribes",
    priceRub: 1190,
    oldPriceRub: 1490,
    stock: 10,
    imageUrl: img("gaming subscription cover art, dark background, neon blue glow, minimal", 11)
  }
]
