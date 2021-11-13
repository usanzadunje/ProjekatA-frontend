<template>
  <ion-page>
    <ion-content>
      <TheSegmentNavigation :segments="this.$store.getters['staff/scheduleSegments']"/>

      <div class="mb-2 px-2 flex justify-between">
        <ion-button
            fill="clear"
            class="reset-button-size"
            @click="previousMonth"
        >
          <ion-icon
              slot="icon-only"
              :icon="chevronBack"
              class="text-gray-400"
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
              class="text-gray-400"
          ></ion-icon>
        </ion-button>
      </div>

      <DayOffCalendarPicker
          v-if="this.$store.getters['auth/isStaff']"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
      />
      <div v-else>
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
  IonButton,
  IonIcon,
  onIonViewWillEnter,
}                               from '@ionic/vue';

import TheSegmentNavigation from '@/components/TheSegmentNavigation';
import DayOffCalendarPicker from '@/components/staff/DayOffCalendarPicker';

import {
  chevronBack,
  chevronForward,
} from 'ionicons/icons';

export default defineComponent({
  name: 'StaffDaysOff',
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonIcon,
    TheSegmentNavigation,
    DayOffCalendarPicker,
  },
  setup() {
    /* Global properties */

    /* Component properties */
    const selectedMonth = ref(new Date().getMonth());
    const selectedYear = ref(new Date().getFullYear());

    /* Composables */

    /* Lifecycle hooks */
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

    return {
      /* Component properties */

      selectedMonth,
      selectedYear,

      /* Event handlers */
      nextMonth,
      previousMonth,

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