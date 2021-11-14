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
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
          :show-skeleton="showSkeleton"
          class="mb-8"
      />
      <div
          v-if="this.$store.getters['auth/isOwner']"
      >
        OWNER CALENDAR LIST
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
  onIonViewWillEnter,
}                               from '@ionic/vue';

import TheSegmentNavigation from '@/components/TheSegmentNavigation';
import DayOffCalendarPicker from '@/components/staff/DayOffCalendarPicker';

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
    TheSegmentNavigation,
    DayOffCalendarPicker,
  },
  setup() {
    /* Global properties */

    /* Component properties */
    const showSkeleton = ref(true);
    const selectedMonth = ref(new Date().getMonth());
    const selectedYear = ref(new Date().getFullYear());

    /* Composables */
    const { fetchRequestedDaysOffForStaff } = useDaysOffRequest();

    /* Lifecycle hooks */
    (async() => {
      await fetchRequestedDaysOffForStaff();

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

      event.target.complete();

      showSkeleton.value = false;
    };

    return {
      /* Component properties */
      showSkeleton,
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
</style>