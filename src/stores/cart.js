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

  function addItem(menu, qty = 1) {
    const existing = items.value.find((i) => i.id === menu.id)
    if (existing) {
      existing.qty += qty
    } else {
      items.value.push({
        id:       menu.id,
        name:     menu.name,
        price:    parseFloat(menu.price),
        image:    menu.image ?? null,
        min_pax:  menu.min_pax ?? null,
        category: menu.category?.name ?? null,
        qty,
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
    if (qty <= 0) {
      removeItem(menuId)
      return
    }
    item.qty = qty
    saveToStorage()
  }

  function clearCart() {
    items.value = []
    localStorage.removeItem('cart')
  }

  return { items, total, count, addItem, removeItem, updateQty, clearCart, saveToStorage }
})
