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

      <div class="mb-2 flex justify-between">
        <ion-button
            fill="clear"
            class="reset-button-size"
            @click="previousMonth"
        >
          <ion-icon
              slot="icon-only"
              :icon="chevronBack"
              class="primary-text-color"
          ></ion-icon>
        </ion-button>

        <div class="flex flex-col items-center">
          <h2 class="secondary-heading">
            {{ selectedYear }}
          </h2>
          <h2 class="secondary-heading underline">
            {{
              $t(new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' }).toLowerCase())
            }}
          </h2>

        </div>

        <ion-button
            fill="clear"
            class="reset-button-size"
            @click="nextMonth"
        >
          <ion-icon
              slot="icon-only"
              :icon="chevronForward"
              class="primary-text-color"
          ></ion-icon>
        </ion-button>
      </div>

      <DayOffCalendarPicker
          v-if="this.$store.getters['auth/isStaff']"
          v-show="!showLoading"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
          :show-skeleton="showSkeleton"
          class="mb-8"
      />

      <DayOffStaffRequests
          v-if="this.$store.getters['auth/isOwner']"
          v-show="!showLoading"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
          :show-skeleton="showSkeleton"
          class="mt-6 mb-8 px-2"
      />

      <div
          v-show="showLoading"
          class="w-full h-3/4 flex items-center justify-center"
      >
        <ion-spinner name="bubbles"></ion-spinner>
      </div>
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
  IonButton,
  IonIcon,
  IonSpinner,
  onIonViewWillEnter,
}                               from '@ionic/vue';

import TheSegmentNavigation from '@/components/TheSegmentNavigation';
import DayOffCalendarPicker from '@/components/staff/DayOffCalendarPicker';
import DayOffStaffRequests  from '@/components/owner/DayOffStaffRequests';

import { useDaysOffRequest } from '@/composables/useDaysOffRequest';

import {
  chevronBack,
  chevronForward,
} from 'ionicons/icons';

export default defineComponent({
  name: 'StaffDaysOff',
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    IonIcon,
    IonSpinner,
    TheSegmentNavigation,
    DayOffCalendarPicker,
    DayOffStaffRequests,
  },
  setup() {
    /* Global properties */

    /* Component properties */
    const showSkeleton = ref(true);
    const showLoading = ref(false);
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
      showLoading,
      selectedMonth,
      selectedYear,

      /* Event handlers */
      nextMonth,
      previousMonth,
      refresh,

      /* Icons */
      chevronBack,
      chevronForward,
    };
  },
});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
  background: var(--show-paint);
}

ion-spinner {
  transform: scale(5);
}
</style>