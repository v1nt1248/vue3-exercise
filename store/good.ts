import dataRes from '@/mock-data/data.json'
import namesRes from '@/mock-data/names.json'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCurrencyStore } from '@/store/currency'

interface NameResItem {
  G: string;
  C?: string;
  B: Record<string, { N: string; T: number; }>;
}

export const useGoodStore = defineStore('good', () => {
  const currencyStore = useCurrencyStore()

  const goodGroups = ref<Record<string, string>>({})
  const goods = ref<Record<string, Good>>({})
  const stock = ref<Stock[]>([])

  const goodList = computed<GoodList>(() => Object.keys(goodGroups.value)
    .reduce((res, grId) => {
      res[grId] = {
        groupName: goodGroups.value[grId],
        goods: stock.value
          .filter(item => item.groupId === grId)
          .map(item => ({
            id: item.goodId,
            name: goods.value[item.goodId].name,
            groupId: grId,
            quantity: item.quantity,
            price: item.usdPrice * currencyStore.currentCurrencyRate,
          }))
      }
      return res
    }, {} as GoodList))

  const fetchGoodGroups = () => {
    goodGroups.value = Object.entries(namesRes).reduce((res, v) => {
      const [ id, value ] = v
      res[id] = value.G
      return res
    }, {} as Record<string, string>)
  }

  const fetchGoods = () => {
    goods.value = Object.entries(namesRes).reduce((res, v) => {
      const [ grId, value ] = v as [string, NameResItem]
      const { B } = value
      Object.entries(B).forEach(([id, data]) => {
        res[id] = {
          id,
          name: data.N,
          groupId: grId,
        }
      })
      return res
    }, {} as Record<string, Good> )
  }

  const fetchStock = () => {
    const { Goods } = dataRes?.Value
    stock.value = Goods.map(item => ({
      goodId: `${item.T}`,
      groupId: `${item.G}`,
      quantity: item.P || 0,
      usdPrice: item.C || 0,
    }))
  }

  return {
    goodList,
    fetchGoodGroups,
    fetchGoods,
    fetchStock,
  }
})
