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
        <div v-if="schedule">
          {{ `${schedule.start_time} - ${calculateEndTime(schedule)}` }}
        </div>
        <div v-else>
          No schedule set.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, toRefs } from 'vue';

import { useSchedule } from '@/composables/useSchedule';

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
  setup(props) {
    /* Global properties */

    /* Component properties */
    const { weekStartDay, weekStartMonth, selectedYear } = toRefs(props);
    const schedule = computed(() => currentSchedule(weekStartDay.value, weekStartMonth.value, selectedYear.value));

    /* Composables */
    const {
      currentSchedule,
      calculateEndTime,
    } = useSchedule();
    /* Event handlers */

    return {
      /* Component properties */
      days,
      getWeekDayNumbers,
      calculateEndTime,
      schedule,

      /* Event handlers */

      /* Icons */
    };
  },
});

</script>
<style scoped>

</style>
