<template>
  <div class="indicators">
    <IndicatorBar v-for="item in list" :key="item.id" :indicator="item" class="indicators__item" />
  </div>
</template>

<script setup>
  import {provide, ref} from 'vue';
  import mock from './../mock.json';
  import IndicatorBar from '@/components/IndicatorBar.vue';

  const list = ref(mock.data);
  const hoverBarId = ref(0);
  const updateHoverBarId = id => hoverBarId.value = id;
  provide('hover', { hoverBarId, updateHoverBarId });
</script>

<style lang="scss">
  @import "src/assets/styles/main";
  
  #app {
    margin: 60px 0 0 0;
    padding: 0 20px;
  }

  .indicators {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px 32px;
  }
  
  .indicators__item {
    min-width: 100%;
    
    @include sm {
      min-width: calc(50% - 16px);
    }
    
  }
</style>
