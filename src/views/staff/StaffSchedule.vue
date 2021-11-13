<template>
  <ion-page>
    <ion-content>
      <TheSegmentNavigation :segments="this.$store.getters['staff/scheduleSegments']"/>

      <div class="flex flex-col gap-1 px-1">
        <div
            v-for="day in weekDays"
            :key="day.id"
            class="w-full h-16 p-1 relative user-selected-paint"
            :class="day.id === new Date().getDay() ? '' : 'opacity-70'"
        >
          <div class="absolute">
            {{ $t(day.name) }}
          </div>
          <div class="w-full h-full flex justify-center items-center">

          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }  from 'vue';
import {
  IonPage,
  IonContent,
}                           from '@ionic/vue';
import TheSegmentNavigation from '@/components/TheSegmentNavigation';

export default defineComponent({
  name: 'StaffSchedule',
  components: {
    IonPage,
    IonContent,
    TheSegmentNavigation,
  },
  setup() {
    /* Global properties */

    /* Component properties */
    const weekDays = [
      {
        id: 1,
        name: 'mon',
      },
      {
        id: 2,
        name: 'tue',
      },
      {
        id: 3,
        name: 'wed',
      },
      {
        id: 4,
        name: 'thu',
      },
      {
        id: 5,
        name: 'fri',
      },
      {
        id: 6,
        name: 'sat',
      },
      {
        id: 0,
        name: 'sun',
      },
    ];


    /* Composables */
    /* Event handlers */


    return {
      /* Component properties */
      weekDays,

      /* Event handlers */


      /* Icons from */
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