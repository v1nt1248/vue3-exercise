<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'
  import { useCurrencyStore } from '@/store/currency'
  import { useGoodStore } from '@/store/good'
  import { round } from '@/utils/helpers'

  const props = defineProps<{
    item: CartItem,
  }>()
  const emit = defineEmits(['delete', 'change:quantity'])

  const currencyStore = useCurrencyStore()
  const goodStore = useGoodStore()

  const _count = ref(1)
  const good = computed<GoodView|undefined>(() => {
    const { id, groupId } = props.item
    return goodStore.goodList[groupId].goods.find(g => g.id === id)
  })

  watch(
    () => props.item.count,
    val => {
      _count.value = val
    },
      { immediate: true },
  )

  const changeQuantity = ({ target }: { target: HTMLInputElement }) => {
    const { id, groupId } = props.item
    const possibleValue = round(Number(target.value), 0)
    _count.value = possibleValue >=0 ? possibleValue : 0
    emit('change:quantity', { id, groupId, value: _count.value })
  }
  const deleteItem = () => {
    emit('delete', props.item)
  }
</script>

<template>
  <div class="item">
    <div class="item__name">
      {{ good?.name }}
    </div>

    <div class="item__quantity">
      <input
        class="item__input"
        type="number"
        v-model="_count"
        @input="changeQuantity"
        @change="changeQuantity"
      />
    </div>

    <div class="item__price">
      {{ round(good?.price || 0) }} {{ currencyStore.selectedCurrency }}/шт
    </div>

    <button
      class="item__action"
      type="button"
      @click="deleteItem"
    >
      Удалить
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .item {
    width: 100%;
    height: calc(var(--base-size) * 6);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 var(--base-size);
    border-bottom: 1px solid var(--black-30);

    &__name {
      width: calc(100% - 280px);
      position: relative;
    }

    &__input {
      width: 100%;
    }

    &__quantity {
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
    }

    &__price {
      width: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
    }

    &__action {
      cursor: pointer;
      padding: 3px 5px;
      border-radius: 4px;
      border: 1px solid var(--black-30);
      margin: 0 5px;
    }
  }
</style>
