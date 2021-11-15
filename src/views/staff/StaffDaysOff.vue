<template>
  <ion-page>
    <ion-content>
      <TheSegmentNavigation :segments="this.$store.getters['staff/scheduleSegments']"/>

      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <NextPreviousNavigation
          class="mb-2"
          @next="nextMonth"
          @previous="previousMonth"
      >
        <div class="flex flex-col items-center">
          <h2 class="secondary-heading">
            {{ selectedYear }}
          </h2>
          <h2 class="secondary-heading underline">
            {{ $t(months[selectedMonth]) }}
          </h2>
        </div>
      </NextPreviousNavigation>

      <DayOffCalendarPicker
          v-if="this.$store.getters['auth/isStaff']"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
          :show-skeleton="showSkeleton"
          class="mb-8"
      />

      <DayOffStaffRequests
          v-if="this.$store.getters['auth/isOwner']"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
          :show-skeleton="showSkeleton"
          class="mt-6 mb-8 px-2"
      />
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
}                               from '@ionic/vue';

import TheSegmentNavigation   from '@/components/TheSegmentNavigation';
import NextPreviousNavigation from '@/components/NextPreviousNavigation';
import DayOffCalendarPicker   from '@/components/staff/DayOffCalendarPicker';
import DayOffStaffRequests    from '@/components/owner/DayOffStaffRequests';

import { useDaysOffRequest } from '@/composables/useDaysOffRequest';

import { months } from '@/utils/helpers';

export default defineComponent({
  name: 'StaffDaysOff',
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    TheSegmentNavigation,
    NextPreviousNavigation,
    DayOffCalendarPicker,
    DayOffStaffRequests,
  },
  setup() {
    /* Global properties */

    /* Component properties */
    const showSkeleton = ref(true);
    const selectedMonth = ref(new Date().getMonth());
    const selectedYear = ref(new Date().getFullYear());

    /* Composables */
    const {
      fetchRequestedDaysOffForStaff,
      fetchRequestedDaysOffFromStaff,
    } = useDaysOffRequest();

    /* Lifecycle hooks */
    (async() => {
      await fetchRequestedDaysOffForStaff();
      await fetchRequestedDaysOffFromStaff();

      showSkeleton.value = false;
    })();
    /* Generating new date in case of stale data */
    onIonViewWillEnter(() => {
      selectedMonth.value = new Date().getMonth();
      selectedYear.value = new Date().getFullYear();
    });

    /* Event handlers */
    const nextMonth = () => {
      if(selectedMonth.value < 11) {
        selectedMonth.value++;
      }else {
        selectedMonth.value = 0;
        selectedYear.value++;
      }
    };
    const previousMonth = () => {
      if(selectedMonth.value > 0) {
        selectedMonth.value--;
      }else {
        selectedMonth.value = 11;
        selectedYear.value--;
      }
    };
    const refresh = async(event) => {
      showSkeleton.value = true;

      await fetchRequestedDaysOffForStaff();
      await fetchRequestedDaysOffFromStaff();

      event.target.complete();

      showSkeleton.value = false;
    };

    return {
      /* Component properties */
      showSkeleton,
      selectedMonth,
      selectedYear,
      months,

      /* Event handlers */
      nextMonth,
      previousMonth,
      refresh,

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