<template>
  <ion-page>
    <ion-content>
      <TheSegmentNavigation :segments="this.$store.getters['staff/scheduleSegments']"/>

      <NextPreviousNavigation
          class="mb-2 px-2"
          @next="nextWeek"
          @previous="previousWeek"
      >
        <div class="flex flex-col items-center">
          <h2 class="secondary-heading underline">
            {{ selectedYear }}
          </h2>
          <h2 class="secondary-heading">
            {{ `${weekStartDay}.${$t(shortMonths[weekStartMonth])} - ${weekEndDay}.${$t(shortMonths[weekEndMonth])}` }}
          </h2>
        </div>
      </NextPreviousNavigation>

      <StaffSchedulePreview
          v-if="this.$store.getters['auth/isStaff']"
          :week-start-day="weekStartDay"
          :week-start-month="weekStartMonth"
          :selected-year="selectedYear"
          class="px-4 mt-6"
      />

    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import {
  IonPage,
  IonContent,
  onIonViewWillEnter,
}                                         from '@ionic/vue';
import TheSegmentNavigation               from '@/components/TheSegmentNavigation';
import NextPreviousNavigation             from '@/components/NextPreviousNavigation';
import StaffSchedulePreview               from '@/components/staff/StaffSchedulePreview';

import { getDaysInAMonth, shortMonths } from '@/utils/helpers';

export default defineComponent({
  name: 'StaffSchedule',
  components: {
    IonPage,
    IonContent,
    NextPreviousNavigation,
    TheSegmentNavigation,
    StaffSchedulePreview,
  },
  setup() {
    /* Global properties */

    /* Component properties */
    let currentDate = new Date();
    const weekStartMonth = ref(currentDate.getMonth());
    const selectedYear = ref(currentDate.getFullYear());
    const weekStartDay = ref(
        new Date(
            selectedYear.value,
            weekStartMonth.value,
            currentDate.getDay() === 0 ? currentDate.getDate() - 6 : currentDate.getDate() - (currentDate.getDay() - 1),
        ).getDate(),
    );
    const weekEndDay = computed(() => {
      const daysLeft = getDaysInAMonth(weekStartMonth.value) - weekStartDay.value;

      return daysLeft >= 6 ? weekStartDay.value + 6 : 6 - daysLeft;
    });
    const weekEndMonth = computed(() => {
      if(weekEndDay.value < weekStartDay.value) {
        return weekStartMonth.value < 11 ? weekStartMonth.value + 1 : 0;
      }
      return weekStartMonth.value;
    });

    /* Composables */
    /* Lifecycle hooks */
    /* Generating new date in case of stale data */
    onIonViewWillEnter(() => {
      currentDate = new Date();
      selectedYear.value = currentDate.getFullYear();
      weekStartMonth.value = currentDate.getMonth();
      weekStartDay.value = new Date(
          selectedYear.value,
          weekStartMonth.value,
          currentDate.getDay() === 0 ? currentDate.getDate() - 6 : currentDate.getDate() - (currentDate.getDay() - 1),
      ).getDate();
    });

    /* Methods */

    /* Event handlers */
    const nextWeek = () => {
      if(getDaysInAMonth(weekStartMonth.value) === weekEndDay.value) {
        weekStartDay.value = 1;
      }else {
        weekStartDay.value = weekEndDay.value + 1;
      }

      if(weekStartDay.value <= 7) {
        if(weekStartMonth.value < 11) {
          weekStartMonth.value++;
        }else {
          weekStartMonth.value = 0;
          selectedYear.value++;
        }
      }
    };
    const previousWeek = () => {
      if(weekStartDay.value > 7) {
        weekStartDay.value -= 7;
      }else {
        const daysToDecreaseFromPreviousMonth = 7 - weekStartDay.value;

        weekStartDay.value = getDaysInAMonth(weekStartMonth.value - 1) - daysToDecreaseFromPreviousMonth;

        if(weekStartMonth.value > 0) {
          weekStartMonth.value--;
        }else {
          weekStartMonth.value = 11;
          selectedYear.value--;
        }
      }
    };

    return {
      /* Component properties */
      shortMonths,
      weekStartMonth,
      weekEndMonth,
      selectedYear,
      weekStartDay,
      weekEndDay,

      /* Event handlers */
      nextWeek,
      previousWeek,

      /* Icons */
    };
  },
});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
  background: var(--show-paint);
}
</style>