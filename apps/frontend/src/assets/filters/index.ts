import donate from "./donate.svg"
import subscribes from "./subscribes.svg"
import items from "./items.svg"
import accounts from "./accounts.svg"
import keys from "./keys.svg"
import game_valut from "./game_valut.svg"
import other from "./other.svg"

export const filterIcons = {
  donate,
  subscribes,
  items,
  accounts,
  keys,
  game_valut,
  other
} as const

export type FilterIconName = keyof typeof filterIcons
