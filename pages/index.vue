<script lang="ts" setup>
  import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
  import { useCurrencyStore } from '@/store/currency'
  import { useGoodStore } from '@/store/good'
  import { REQUEST_INTERVAL } from '@/utils/constants'

  const currencyStore = useCurrencyStore()
  const goodStore = useGoodStore()

  const count = ref(0)
  const timerId = ref()

  await useAsyncData(
    'currencies',
    async () => {
      await currencyStore.fetchCurrencyRates()

      timerId.value = setTimeout(() => {
        count.value += 1
      }, REQUEST_INTERVAL)
    },
    { watch: [count] },
  )

  onBeforeMount(async() => {
    goodStore.fetchGoodGroups()
    goodStore.fetchGoods()
    goodStore.fetchStock()
  })

  onBeforeUnmount(() => {
    clearTimeout(timerId.value)
    timerId.value = null
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
