<script lang="ts" setup>
  import { onBeforeMount } from 'vue'
  import { useCurrencyStore } from '@/store/currency'
  import { useGoodStore } from '@/store/good'
  import GoodGroup from '@/components/good-group.vue'
  import Cart from '@/components/cart.vue'
  import CurrencySelect from '@/components/currency-select.vue'

  const currencyStore = useCurrencyStore()
  const goodStore = useGoodStore()

  onBeforeMount(async() => {
    await currencyStore.fetchCurrencyRates()
    goodStore.fetchGoodGroups()
    goodStore.fetchGoods()
    goodStore.fetchStock()
  })
</script>

<template>
  <section class="main">
    <div class="main__goods">
      <template
        v-for="(group, groupId) in goodStore.goodList"
        :key="groupId"
      >
        <good-group
          v-if="group.goods.length"
          :group="group"
        />
      </template>
    </div>

    <div class="main__cart">
      <currency-select
        :value="currencyStore.selectedCurrency"
      />

      <cart />
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .main {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--base-size);
    display: flex;
    justify-content: space-between;
    align-items: stretch;

    &__goods {
      width: 60%;
      overflow-y: auto;
    }

    &__cart {
      width: calc(40% - calc(var(--base-size) * 2));
      overflow-y: auto;

      .currency-select {
        margin-bottom: calc(var(--base-size) * 2);
      }
    }
  }
</style>