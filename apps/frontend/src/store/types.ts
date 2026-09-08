import type { Product } from '@repo/shared'

export type ShopStore = {
    products: Product[]
    isLoading: boolean
    error: string | null
    init: () => void
    getProduct: (sku: string) => Product | undefined
}
