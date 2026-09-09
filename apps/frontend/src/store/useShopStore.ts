import { create } from 'zustand'
import { getProducts } from 'src/api/shopApi'
import { API_URL } from 'src/api/client'
import { ShopStore } from './types';

let eventSource: EventSource | null = null;
let abortController: AbortController | null = null;

export const useShopStore = create<ShopStore>((set, get) => ({
  products: [],
  isLoading: true, // Only true on the very first load
  isFetching: false, // True during any background request
  hasInit: false,
  error: null,
  search: undefined,
  category: undefined,

  getProduct: (sku: string) => {
    return get().products.find(p => p.id === sku)
  },

  fetchFilteredProducts: async (search?: string, category?: string) => {
    // If there's an ongoing fetch, abort it to avoid race conditions
    if (abortController) {
      abortController.abort()
    }
    abortController = new AbortController()

    try {
      const isInitialLoad = !get().hasInit;

      set({
        search,
        category,
        isFetching: true,
        // Only show full skeleton screen on very first app load
        isLoading: isInitialLoad ? true : false,
        error: null
      })

      const products = await getProducts(search, category, abortController.signal)
      set({
        products,
        isLoading: false,
        isFetching: false,
        hasInit: true,
        error: null
      })
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        // Ignored, because a new fetch started
        return
      }
      set({
        error: error.message || 'Failed to fetch products',
        isLoading: false,
        isFetching: false,
        hasInit: true
      })
    }
  },

  init: async (search?: string, category?: string) => {
    // Fetch products initially
    await get().fetchFilteredProducts(search, category)

    if (!eventSource) {
      // Automatically reconnects on failure
      eventSource = new EventSource(`${API_URL}/api/products/stream`)

      eventSource.onmessage = async (event) => {
        console.log("SSE Event Received:", event.data)
        // Simple but effective: refetch all products when any product updates
        // We use the current search and category from state!
        const state = get()
        await state.fetchFilteredProducts(state.search, state.category)
      }

      eventSource.onerror = async (error) => {
        console.error("SSE Error:", error)
      }

      eventSource.onopen = async () => {
        console.log("SSE Connection opened/reconnected")
        const state = get()
        await state.fetchFilteredProducts(state.search, state.category)
      }
    }
  }
}))
