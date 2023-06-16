<script lang="ts" setup>
  import { useCurrencyStore } from '@/store/currency'
  import { useCartStore } from '@/store/cart'
  import { round } from '@/utils/helpers'
  import Item from '@/components/item.vue'

  const currencyStore = useCurrencyStore()
  const cartStore = useCartStore()

  const onQuantityChange = ({ id, groupId, value }: { id: string, groupId: string, value: number }) => {
    cartStore.changeItemCount({ id, groupId, value})
  }

  const onDelete = (good: GoodView) => {
    cartStore.removeFromCart(good)
  }
</script>

<template>
  <div class="cart">
    <div class="cart__name">
      Корзина
    </div>

    <div class="cart__content">
      <item
        v-for="item in cartStore.cart"
        :key="item.id"
        :item="item"
        @change:quantity="onQuantityChange"
        @delete="onDelete"
      />
    </div>

    <div class="cart__summary">
      Общая стоимость: <span class="cart__total">{{ round(cartStore.total) }}</span> {{ currencyStore.selectedCurrency }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .cart {
    --element-height: calc(var(--base-size) * 6);

    border: 1px solid var(--black-30);

    &__name {
      width: 100%;
      height: var(--element-height);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 var(--base-size);
      background-color: brown;
      color: var(--system-white);
      font-size: 16px;
      font-weight: 600;
    }

    &__content {
      position: relative;
      min-height: var(--element-height);
    }

    &__summary {
      display: flex;
      width: 100%;
      height: var(--element-height);
      padding: 0 var(--base-size);
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      line-height: 18px;
      font-weight: 300;
    }

    &__total {
      font-size: 18px;
      line-height: 18px;
      font-weight: 500;
      padding: 0 var(--base-size);
    }
  }
</style>
