import type { Product } from '@repo/shared'

export type ShopStore = {
    products: Product[]
    isLoading: boolean // Первичная загрузка
    isFetching: boolean // Фоновая загрузка (поиск/фильтрация)
    hasInit: boolean
    error: string | null
    search?: string
    category?: string
    init: (search?: string, category?: string) => void
    fetchFilteredProducts: (search?: string, category?: string) => Promise<void>
    getProduct: (sku: string) => Product | undefined
}
