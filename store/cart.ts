import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGoodStore } from '@/store/good'

export const useCartStore = defineStore('cart', () => {
  const goodStore = useGoodStore()

  const cart = ref<CartItem[]>([])

  const total = computed<number>(() => cart.value.reduce((acc, item) => {
    const { id, groupId, count } = item
    const good = goodStore.goodList[groupId].goods.find(g => g.id === id)
    if (good) {
      const { price } = good
      acc += count * price
    }
    return acc
  }, 0))

  const addToCart = (good: GoodView) => {
    const goodIndex = cart.value.findIndex(g => g.id === good.id && g.groupId === good.groupId)
    if (goodIndex === -1) {
      cart.value.push({
        id: good.id,
        groupId: good.groupId,
        count: 1,
      })
    } else {
      cart.value[goodIndex].count += 1
    }
  }

  const changeItemCount = ({ id, groupId, value }: { id: string, groupId: string, value: number }) => {
    const goodIndex = cart.value.findIndex(g => g.id === id && g.groupId === groupId)
    if (goodIndex !== -1) {
      cart.value[goodIndex].count = value
    }
  }

  const removeFromCart = (good: GoodView) => {
    const goodIndex = cart.value.findIndex(g => g.id === good.id && g.groupId === good.groupId)
    cart.value.splice(goodIndex, 1)
  }

  return {
    cart,
    total,
    addToCart,
    changeItemCount,
    removeFromCart,
  }
})
