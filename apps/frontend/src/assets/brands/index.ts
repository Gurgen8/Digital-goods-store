import appstore from "./appstore.png";
import brawlstars from "./brawlstars.png";
import chatgpt from "./chatgpt.png";
import mobilelegends from "./mobilelegends.png";
import more from "./more.png";
import playstation from "./playstation.png";
import pubg from "./pubg.png";
import roblox from "./roblox.png";
import steam from "./steam.png";
import telegram from "./telegram.png";
import tiktok from "./tiktok.png";

export const brandIconSrc = {
  appstore,
  brawlstars,
  chatgpt,
  mobilelegends,
  more,
  playstation,
  pubg,
  roblox,
  steam,
  telegram,
  tiktok,
} as const;

export type BrandName = keyof typeof brandIconSrc;
