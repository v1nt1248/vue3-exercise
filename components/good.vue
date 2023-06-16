<script lang="ts" setup>
  import { useCurrencyStore } from '@/store/currency'
  import { round } from '@/utils/helpers'

  const props = defineProps<{
    good: GoodView;
  }>()
  const emit = defineEmits(['select'])

  const currencyStore = useCurrencyStore()
</script>

<template>
  <div
    class="good"
    @click="emit('select', props.good)"
  >
    <div class="good__name">
      {{ props.good.name }} ({{ props.good.quantity }})
    </div>

    <div class="good__price">
      {{ round(props.good.price) }} {{ currencyStore.selectedCurrency }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .good {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    height: calc(var(--base-size) * 6);
    padding-left: calc(var(--base-size) * 2);
    border-bottom: 1px solid var(--black-30);
    font-size: 14px;
    cursor: pointer;

    &__name {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: calc(100% - 100px);
    }

    &__price {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      background-color: var(--black-30);
      font-size: 12px;
    }

    &:hover {
      background-color: var(--black-30);
    }
  }
</style>
