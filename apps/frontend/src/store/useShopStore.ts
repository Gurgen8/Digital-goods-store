import { create } from 'zustand'
import { getProducts } from '../api/shopApi'
import { API_URL } from '../api/client'
import { ShopStore } from './types';


let eventSource: EventSource | null = null;

export const useShopStore = create<ShopStore>((set, get) => ({
  products: [],
  isLoading: true,
  error: null,

  getProduct: (sku: string) => {
    return get().products.find(p => p.id === sku)
  },

  init: async () => {
    try {
      set({ isLoading: true, error: null })
      const products = await getProducts()
      set({ products, isLoading: false })

      if (!eventSource) {
        // Automatically reconnects on failure
        eventSource = new EventSource(`${API_URL}/api/products/stream`)

        eventSource.onmessage = async (event) => {
          console.log("SSE Event Received:", event.data)
          // Simple but effective: refetch all products when any product updates
          const freshProducts = await getProducts()
          set({ products: freshProducts })
        }

        // On open, we should also fetch once just to be sure we didn't miss events
        // between initial fetch and SSE connection open, but our fetch is already fresh enough.

        eventSource.onerror = async (error) => {
          console.error("SSE Error:", error)
          // EventSource has built-in auto-reconnect. When it reconnects, it might have missed events.
          // The onopen event fires when it reconnects.
        }

        eventSource.onopen = async () => {
          console.log("SSE Connection opened/reconnected")
          // Refetch to sync state after a disconnect
          const freshProducts = await getProducts()
          set({ products: freshProducts })
        }
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch products', isLoading: false })
    }
  }
}))
