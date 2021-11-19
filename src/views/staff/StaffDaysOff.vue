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
          @go-to-today="goToToday"
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
          :request-id-to-open="ownerRequestIdAdded"
          class="mt-6 mb-8 px-2"
      />
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter }         from 'vue-router';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
}                                      from '@ionic/vue';

import TheSegmentNavigation   from '@/components/TheSegmentNavigation';
import NextPreviousNavigation from '@/components/NextPreviousNavigation';
import DayOffCalendarPicker   from '@/components/staff/DayOffCalendarPicker';
import DayOffStaffRequests    from '@/components/owner/DayOffStaffRequests';

import { useDaysOffRequest } from '@/composables/useDaysOffRequest';

import { months }           from '@/utils/helpers';
import { useNotifications } from '@/composables/useNotificataions';

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
    const route = useRoute();
    const router = useRouter();

    /* Component properties */
    let currentDate = new Date();
    const showSkeleton = ref(true);
    const selectedMonth = ref(currentDate.getMonth());
    const selectedYear = ref(currentDate.getFullYear());
    const ownerRequestIdAdded = ref();

    /* Composables */
    const {
      fetchRequestedDaysOffForStaff,
      fetchRequestedDaysOffStatusesForStaff,
      fetchRequestedDaysOffFromStaff,
    } = useDaysOffRequest();
    const { newestNotificationPayload } = useNotifications();

    /* Methods */
    const goToToday = () => {
      currentDate = new Date();
      selectedMonth.value = currentDate.getMonth();
      selectedYear.value = currentDate.getFullYear();
    };

    /* Lifecycle hooks */
    (async() => {
      await fetchRequestedDaysOffForStaff();
      await fetchRequestedDaysOffFromStaff();

      showSkeleton.value = false;
    })();
    /* Generating new date in case of stale data */
    onIonViewWillEnter(() => {
      goToToday();

      if(route.query.month && route.query.year) {
        selectedMonth.value = Number(route.query.month);
        selectedYear.value = Number(route.query.year);

        if(route.query.id) {
          ownerRequestIdAdded.value = Number(route.query.id);
        }else {
          router.replace();
        }
      }
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

      await fetchRequestedDaysOffStatusesForStaff();
      await fetchRequestedDaysOffFromStaff();

      event.target.complete();

      showSkeleton.value = false;
    };

    /* Watchers */
    watch(newestNotificationPayload, () => {
      selectedMonth.value = newestNotificationPayload.value?.month;
      selectedYear.value = newestNotificationPayload.value?.year;
      if(newestNotificationPayload.value?.id) {
        ownerRequestIdAdded.value = newestNotificationPayload.value.id;
      }
    });

    return {
      /* Component properties */
      showSkeleton,
      selectedMonth,
      selectedYear,
      months,
      ownerRequestIdAdded,
      newestNotificationPayload,

      /* Event handlers */
      nextMonth,
      previousMonth,
      goToToday,
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