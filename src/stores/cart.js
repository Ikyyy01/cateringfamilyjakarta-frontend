import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  )

  const count = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0)
  )

  function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  function addItem(menu, qty = null) {
    const minPax = menu.min_pax || 20
    const addQty = qty ?? minPax
    const existing = items.value.find((i) => i.id === menu.id)
    if (existing) {
      existing.qty += addQty
    } else {
      items.value.push({
        id:       menu.id,
        name:     menu.name,
        price:    parseFloat(menu.price),
        image:    menu.image ?? null,
        min_pax:  menu.min_pax ?? 20,
        category: menu.category?.name ?? null,
        qty: Math.max(addQty, minPax),
      })
    }
    saveToStorage()
  }

  function removeItem(menuId) {
    items.value = items.value.filter((i) => i.id !== menuId)
    saveToStorage()
  }

  function updateQty(menuId, qty) {
    const item = items.value.find((i) => i.id === menuId)
    if (!item) return
    const minPax = item.min_pax || 20
    if (qty <= 0) {
      removeItem(menuId)
      return
    }
    item.qty = Math.max(qty, minPax)
    saveToStorage()
  }

  function clearCart() {
    items.value = []
    localStorage.removeItem('cart')
  }

  return { items, total, count, addItem, removeItem, updateQty, clearCart, saveToStorage }
})
