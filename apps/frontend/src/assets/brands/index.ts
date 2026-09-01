import steam from "./figma/steam.png"
import telegram from "./figma/telegram.png"
import roblox from "./figma/roblox.png"
import brawlstars from "./figma/brawlstars.png"
import pubg from "./figma/pubg.png"
import appstore from "./figma/appstore.png"
import chatgpt from "./figma/chatgpt.png"
import playstation from "./figma/playstation.png"
import tiktok from "./figma/tiktok.png"
import mobilelegends from "./figma/mobilelegends.png"
import discord from "./discord.svg"
import more from "./figma/more.png"

export const brandIconSrc = {
  steam,
  telegram,
  roblox,
  brawlstars,
  pubg,
  appstore,
  chatgpt,
  playstation,
  tiktok,
  mobilelegends,
  discord,
  more
} as const

export type BrandName = keyof typeof brandIconSrc
