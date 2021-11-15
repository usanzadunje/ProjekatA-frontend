<template>
  <div class="flex flex-col gap-1 ">
    <div
        v-for="(day, index) in getWeekDayNumbers(weekStartDay, weekStartMonth, selectedYear)"
        :key="day"
        class="w-full h-16 p-2 relative user-selected-paint rounded-md"
        :class="day === new Date().getDate() ? '' : 'opacity-75'"
    >
      <div class="absolute">
        <span class="primary-text-color font-bold uppercase">{{ $t(days[index]) }}</span>
      </div>
      <div class="w-full h-full flex justify-end items-start">
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import { getWeekDayNumbers, days } from '@/utils/helpers';

export default defineComponent({
  name: 'StaffSchedulePreview',
  components: {},
  props: {
    weekStartDay: {
      type: Number,
      default: null,
      required: true,
    },
    weekStartMonth: {
      type: Number,
      default: null,
      required: true,
    },
    selectedYear: {
      type: Number,
      default: null,
      required: true,
    },
  },
  setup() {
    /* Global properties */

    /* Component properties */

    /* Composables */

    /* Event handlers */

    return {
      /* Component properties */
      days,
      getWeekDayNumbers,

      /* Event handlers */

      /* Icons */
    };
  },
});

</script>
<style scoped>

</style>
