<template>
  <div class="indicator" :class="indicatorClass">
    <div class="indicator__title">{{ indicator.title }}</div>
    
    <div ref="bar" class="indicator__bar">
      <template v-for="(segmentValue, segmentName) in indicator.values" :key="segmentName">
        <div v-if="segmentValue"
             class="indicator__segment segment"
             :class="[segmentName, { active: segmentName === activeSegment }]"
             :style="{ width: segmentWidth(segmentValue) }"
             @mouseover.self="hoverHandler(indicator.id, segmentName)"
             @mouseleave.self="hoverHandler()">
          <span ref="segmentTopInfo" class="segment__info segment__top">
            {{ segmentFormatName(segmentName) + ' - ' + segmentWidth(segmentValue) }}
          </span>
          <span ref="segmentBottomInfo" class="segment__info segment__bottom">
            {{ segmentValue + ' ' + indicator.item }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  import {defineProps, ref, onMounted, computed, inject} from 'vue';
  import {usePosition} from "@/hooks";

  const props = defineProps({
    indicator: {
      type: Object,
      required: true,
    },
  });
  const {hoverBarId, updateHoverBarId} = inject('hover');
  const activeSegment = ref('');
  const indicatorClass = computed(() => { // indicator class name based on hoverBarId
    return hoverBarId.value === props.indicator.id ? 'hover' : hoverBarId.value ? 'fade' : ''
  })
  const sumIndicatorValues = computed(() => { // sum all the values to know the value of 100%
    return Object.values(props.indicator.values).reduce((cur, sum) => (sum += cur), 0)
  });
  const segmentWidth = computed(() => { // calculate the width of segment (get as a parameter)
    return num => Math.round((num / sumIndicatorValues.value) * 100) + '%'
  });
  const segmentFormatName = computed(() => { // get formatted segment name
    return (segmentName) => segmentName.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')
  })

  const hoverHandler = (barId = 0, segment = '') => { // set active segment and bar
    activeSegment.value = segment;
    updateHoverBarId(barId);
  };
  
  // get node of bar and node arrays of info blocks
  const bar = ref(null);
  const segmentTopInfo = ref([]);
  const segmentBottomInfo = ref([]);
  
  const checkRightAlign = () => { // check if it needs to be right aligned
    const {right: rightBorderBar} = usePosition(bar.value) // right point of the entire bar

    segmentTopInfo.value.forEach((topInfoItem, idx) => {
      const {right: rightBorderTopInfo} = usePosition(topInfoItem); // right point of the top info block
      const {right: rightBorderBottomInfo} = usePosition(segmentBottomInfo.value[idx]); // right point of the bottom info block
      const maxRightBorderInfo = Math.max(rightBorderTopInfo, rightBorderBottomInfo); // max right point of two info blocks

      if (maxRightBorderInfo > rightBorderBar) { // if the block goes beyond the right border of the bar -> set right alignment
        topInfoItem.classList.add('right');
        segmentBottomInfo.value[idx].classList.add('right');
      }
    });
  }

  onMounted(() => {
    checkRightAlign()
    window.addEventListener('resize', checkRightAlign)
  });
</script>

<style lang="scss" scoped>
  .indicator {
    padding: 20px 0;
    display: flex;
    align-items: center;
    gap: 16px;
    overflow: hidden;
    transition: all 0.3s;
    
    &.fade {
      opacity: 0.08;
    }
    
    &.hover {
      .indicator__segment:not(.active) {
        opacity: 0.08;
      }
    }
  }
  
  .indicator__title {
    flex-shrink: 0;
    width: 20%;
    max-width: 150px;
    min-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .indicator__bar {
    display: flex;
    align-items: center;
    border-radius: 4px;
    height: 6px;
    width: 100%;
    gap: 1px;
  }
  
  .indicator__segment {
    min-width: 8px;
    height: 6px;
    
    &:first-child {
      border-radius: 4px 0 0 4px;
    }
  
    &:last-child {
      border-radius: 0 4px 4px 0;
    }
    
    &.active {
      color: $color-not;
      background: $color-not;
    }
    
    &.low {
      color: $color-low;
      background: $color-low;
    }
    
    &.medium {
      color: $color-medium;
      background: $color-medium;
    }
    
    &.high {
      color: $color-high;
      background: $color-high;
    }
  }
  
  // Segment
  
  .segment {
    position: relative;
    background: #f2f2f2;
    color: #f2f2f2;
    cursor: pointer;
    transition: opacity 0.3s;
    
    &.active {
      opacity: 1;
    }
    
    &.empty {
      min-width: auto;
    }
    
    &:hover {
      .segment__info {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  
  .segment__info {
    position: absolute;
    left: 0;
    opacity: 0;
    visibility: hidden;
    width: max-content;
    transition: all 0.3s;
    z-index: 0;
    font-size: 14px;
    line-height: 22px;
    
    &.right {
      left: auto;
      right: 0;
    }
  }
  
  .segment__top {
    bottom: calc(100% + 5px);
    font-weight: bold;
  }
  
  .segment__bottom {
    top: calc(100% + 5px);
  }
</style>
