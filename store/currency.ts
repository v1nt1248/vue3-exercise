import { defineStore } from 'pinia'
import { ref } from 'vue'
import { $fetch } from 'ofetch'
import { EXCHANGE_RATES_API } from '@/utils/constants'

export const useCurrencyStore = defineStore('currency', () => {
  const selectedCurrency = ref<string>('USD')
  const currencyRates = ref<Record<string, { id: string, rate: number }>>({})

  const currentCurrencyRate = computed<number>(() => {
    const currency = currencyRates.value[selectedCurrency.value]
    return currency?.rate || 1
  })

  const fetchCurrencyRates = async (): Promise<void> => {
    const result: CurrencyRatesResult = await $fetch(EXCHANGE_RATES_API)
    if (result.success && result.rates) {
      currencyRates.value = Object.keys(result.rates).reduce((res, currency) => {
        res[currency] = { id: currency, rate: result.rates![currency] }
        return res
      }, {} as Record<string, { id: string, rate: number }>)
    }
  }

  const setCurrentCurrency = (currency: string) => {
    selectedCurrency.value = currency
  }

  return {
    currencyRates,
    selectedCurrency,
    currentCurrencyRate,
    setCurrentCurrency,
    fetchCurrencyRates,
  }
})
