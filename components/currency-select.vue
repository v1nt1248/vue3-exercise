<script lang="ts" setup>
  import { computed, nextTick, ref, watch } from 'vue'
  import { onClickOutside } from '@vueuse/core'
  import { useCurrencyStore } from '@/store/currency'

  const props = defineProps<{
    value: string;
  }>()

  const currencyStore = useCurrencyStore()

  const inputElement = ref<HTMLInputElement|undefined>(undefined)
  const listElement = ref(null)
  const text = ref('')
  const itemIndex = ref(0)
  const isFocused = ref(false)

  const filteredCurrencies = computed(() => {
    return Object.values(currencyStore.currencyRates).reduce((res, currency) => {
      const { id } = currency
      if (id.toLowerCase().includes(text.value.toLowerCase())) {
        res.push(currency)
      }
      return res
    }, [] as { id: string, rate: number }[])
  })
  const focusedItem = computed<{ id: string, rate: number} | null>(() => {
    if (filteredCurrencies.value.length === 0) {
      return null
    }

    return filteredCurrencies.value[itemIndex.value]
  })

  watch(
  () => props.value,
    val => text.value = val,
    { immediate: true },
  )

  const onFocus = () => {
    text.value = ''
    itemIndex.value = 0
    isFocused.value = true
    nextTick(() => {
      onClickOutside(listElement, (evt: PointerEvent) => {
        const target = evt.target as HTMLElement
        if (target.nodeName !== 'INPUT') {
          isFocused.value = false
          itemIndex.value = 0
          text.value = currencyStore.selectedCurrency
        }
      })
    })
  }

  const selectCurrency = currency => {
    currencyStore.setCurrentCurrency(currency)
    isFocused.value = false
  }

  const scroll = (id: string) => {
    const el = document.getElementById(id)
    el && el.scrollIntoView({ block: "nearest" })
  }

  const onKeydown = ev => {
    const { key } = ev
    switch (key) {
      case 'ArrowDown':
        if (itemIndex.value < (filteredCurrencies.value.length - 1)) {
          itemIndex.value += 1
          scroll(focusedItem.value!.id)
        }
        break
      case 'ArrowUp':
        if (itemIndex.value > 0) {
          itemIndex.value -= 1
          scroll(focusedItem.value!.id)
        }
        break
      case 'Enter':
        focusedItem.value && selectCurrency(focusedItem.value?.id)
        if (!focusedItem.value) {
          text.value = currencyStore.selectedCurrency
        }
        inputElement.value!.blur()
        itemIndex.value = 0
        break
    }
  }
</script>

<template>
  <div class="currency-select">
    <input
      ref="inputElement"
      class="currency-select__input"
      type="text"
      v-model="text"
      @focusin="onFocus"
      @keydown="onKeydown"
    >
    <div class="currency-select__info">
      {{ currencyStore.currentCurrencyRate }} {{ currencyStore.selectedCurrency }} за 1 USD
    </div>

    <div
      v-if="isFocused"
      ref="listElement"
      class="currency-select__list"
    >
      <div
        v-for="(currency, index) in filteredCurrencies"
        :id="currency.id"
        :key="currency.id"
        :class="[
          'currency-select__list-item',
          { 'currency-select__list-item--selected': itemIndex === index },
        ]"
        @click.self="selectCurrency(currency.id)"
      >
        {{ currency.id }} ({{ currency.rate }})
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .currency-select {
    --select-width: 140px;
    --select-item-height: 24px;

    position: relative;
    width: 100%;
    height: var(--select-item-height);
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &__input {
      width: var(--select-width);
      margin-right: var(--base-size);
    }

    &__list {
      position: absolute;
      left: 0;
      top: calc(var(--select-item-height) + 2px);
      width: calc(var(--select-width) + 8px);
      min-height: calc(var(--select-item-height) * 2);
      max-height: calc(var(--select-item-height) * 10);
      background-color: var(--system-white);
      overflow-y: auto;
      border-radius: 2px;
      border: 1px solid var(--black-30);
      z-index: 2;
      box-shadow:
        0 3px 3px -2px rgba(0, 0, 0, 0.2),
        0 3px 4px 0 rgba(0, 0, 0, 0.14),
        0 1px 8px 0 rgba(0, 0, 0, 0.12);

      &-item {
        display: flex;
        width: 100%;
        height: var(--select-item-height);
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        padding: 0 calc(var(--base-size) / 2);
        cursor: pointer;

        &--selected,
        &:hover {
          background-color: var(--black-30);
        }
      }
    }

    &__info {
      font-size: 14px;
      font-weight: 400;
    }
  }
</style>
