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
          class="mb-2 px-2"
          @next="nextWeek"
          @previous="previousWeek"
          @go-to-today="goToToday"
      >
        <div class="flex flex-col items-center">
          <h2 class="secondary-heading">
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
          :show-skeleton="showSkeleton"
          class="px-4 mt-6"
      />

      <OwnerSchedulePreview
          v-if="this.$store.getters['auth/isOwner']"
          :week-start-day="weekStartDay"
          :week-start-month="weekStartMonth"
          :selected-year="selectedYear"
          :show-skeleton="showSkeleton"
          class="px-4 mt-6"
      />

    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
}                                                from '@ionic/vue';
import TheSegmentNavigation                      from '@/components/TheSegmentNavigation';
import NextPreviousNavigation                    from '@/components/NextPreviousNavigation';
import StaffSchedulePreview                      from '@/components/staff/StaffSchedulePreview';
import OwnerSchedulePreview                      from '@/components/owner/OwnerSchedulePreview';

import { useSchedule } from '@/composables/useSchedule';

import { getDaysInAMonth, shortMonths } from '@/utils/helpers';
import { useRoute, useRouter }          from 'vue-router';
import { useNotifications }             from '@/composables/useNotificataions';

export default defineComponent({
  name: 'StaffSchedule',
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    NextPreviousNavigation,
    TheSegmentNavigation,
    StaffSchedulePreview,
    OwnerSchedulePreview,
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();

    /* Component properties */
    const weekStartMonth = ref();
    const selectedYear = ref();
    const weekStartDay = ref();
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
    const showSkeleton = ref(true);

    /* Composables */
    const {
      fetchScheduleForStaff,
      fetchScheduleForOwner,
    } = useSchedule();
    const { newestNotificationPayload } = useNotifications();

    /* Methods */
    const goToToday = () => {
      let currentDate = new Date();

      const currentDay = currentDate.getDay() === 0 ? currentDate.getDate() - 6 : currentDate.getDate() - (currentDate.getDay() - 1);

      selectedYear.value = currentDate.getFullYear();
      weekStartMonth.value = currentDate.getMonth();

      if(currentDay <= 0) {
        if(weekStartMonth.value - 1 > 0) {
          weekStartMonth.value--;
        }else {
          weekStartMonth.value = 11;
          selectedYear.value--;
        }
        currentDate = new Date(selectedYear.value, weekStartMonth.value, getDaysInAMonth(weekStartMonth.value));
      }

      weekStartDay.value = new Date(
          selectedYear.value,
          weekStartMonth.value,
          currentDate.getDay() === 0 ? currentDate.getDate() - 6 : currentDate.getDate() - (currentDate.getDay() - 1),
      ).getDate();


    };

    /* Lifecycle hooks */
    goToToday();
    (async() => {
      await fetchScheduleForStaff();
      await fetchScheduleForOwner();

      showSkeleton.value = false;
    })();
    /* Generating new date in case of stale data */
    onIonViewWillEnter(() => {
      goToToday();

      if(route.query.day && route.query.month && route.query.year) {
        weekStartDay.value = Number(route.query.day);
        weekStartMonth.value = Number(route.query.month);
        selectedYear.value = Number(route.query.year);

        router.replace();
      }
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
    const refresh = async(event) => {
      showSkeleton.value = true;

      await fetchScheduleForStaff();
      await fetchScheduleForOwner(true);

      event.target.complete();

      showSkeleton.value = false;
    };

    /* Watchers */
    watch(newestNotificationPayload, () => {
      weekStartDay.value = newestNotificationPayload.value?.day;
      weekStartMonth.value = newestNotificationPayload.value?.month;
      selectedYear.value = newestNotificationPayload.value?.year;
    });

    return {
      /* Component properties */
      shortMonths,
      weekStartMonth,
      weekEndMonth,
      selectedYear,
      weekStartDay,
      weekEndDay,
      showSkeleton,

      /* Event handlers */
      nextWeek,
      previousWeek,
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