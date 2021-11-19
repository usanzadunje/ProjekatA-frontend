<template>
  <div>
    <div
        v-if="!showSkeleton"
        class="flex flex-col gap-1"
    >
      <div
          v-for="(day, index) in getWeekDayNumbers(weekStartDay, weekStartMonth, selectedYear)"
          :key="day"
          class="w-full h-16 p-2 relative user-selected-paint rounded-md"
          :class="dateIsCurrentDate(day, weekStartMonth, selectedYear) ? '' : 'opacity-75'"
      >
        <div class="h-full flex justify-between">
          <span class="primary-text-color font-bold uppercase">{{ $t(days[index]) }}</span>
          <div class="">
            <div
                v-if="schedule"
                class="h-full w-full flex flex-col justify-between items-center"
            >
              <ion-icon
                  slot="icon-only"
                  :icon="timeOutline"
                  class="text-xl"
              ></ion-icon>
              <span class="font-medium">{{ `${schedule.start_time} - ${calculateEndTime(schedule)}` }}</span>
            </div>
            <div
                v-else
            >
              {{ $t('noSchedule') + '.' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
        v-else
        class="flex flex-col gap-1 "
    >
      <div
          v-for="i in 10"
          :key="i"
          class="w-full h-16 rounded-md"
      >
        <ion-skeleton-text
            animated
        >
        </ion-skeleton-text>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, toRefs } from 'vue';
import { IonIcon, IonSkeletonText }          from '@ionic/vue';

import { useSchedule } from '@/composables/useSchedule';

import { getWeekDayNumbers, days, dateIsCurrentDate } from '@/utils/helpers';

import {
  timeOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'StaffSchedulePreview',
  components: {
    IonIcon,
    IonSkeletonText,
  },
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
    showSkeleton: {
      type: Boolean,
      default: true,
      required: false,
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
      dateIsCurrentDate,

      /* Event handlers */

      /* Icons */
      timeOutline,
    };
  },
});

</script>
<style scoped>

</style>
