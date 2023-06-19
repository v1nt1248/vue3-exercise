<script lang="ts" setup>
  import { useCartStore } from '@/store/cart'
  import Good from '@/components/good.vue'

  const props = defineProps<{
    group: {
      groupName: string;
      goods: GoodView[];
    };
  }>()

  const cartStore = useCartStore()

  const onSelect = (good: GoodView) => {
    cartStore.addToCart(good)
  }
</script>

<template>
  <div class="good-group">
    <div class="good-group__name">
      {{ props.group.groupName }}
    </div>
    <good
      v-for="good in props.group.goods"
      :key="good.id"
      :good="good"
      @select="onSelect"
    />
  </div>
</template>

<style lang="scss" scoped>
  .good-group {
    padding-bottom: calc(var(--base-size) * 2);

    &__name {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: calc(var(--base-size) * 6);
      background-color: var(--system-black);
      color: var(--system-white);
      padding: 0 calc(var(--base-size) * 2);
      font-size: 16px;
      font-weight: 600;
    }
  }
</style>
