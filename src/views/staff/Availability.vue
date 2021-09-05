<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <ion-refresher pull-min="60" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            :pulling-text="$t('refresherPulling')"
            refreshing-spinner="crescent"
            :refreshing-text="$t('refresherText')"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div class="staff-container">
        <h1 class="text-center uppercase secondary-heading">{{ $t('currently') }} {{ $t('in') }} {{ place?.name }}</h1>

        <h1 class="text-center uppercase main-heading mt-10">{{ availabilityRatio }}</h1>

        <AvailabilityToggleButtons/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n }  from 'vue-i18n';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
}                   from '@ionic/vue';


import StaffService from '@/services/StaffService';

import AvailabilityToggleButtons from '@/components/staff/AvailabilityToggleButtons';

import { useToastNotifications } from '@/composables/useToastNotifications';


export default {
  name: "Availability",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    AvailabilityToggleButtons,
  },
  setup() {
    /* Component properties */
    const store = useStore();

    /* Computed properties */
    const place = computed(() => store.getters['staff/place']);
    const availabilityRatio = computed(() => store.getters['staff/availabilityRatio']);

    /* Composables */
    const { t } = useI18n();
    const { showErrorToast } = useToastNotifications();


    /* Event handlers */
    const refresh = async(event) => {
      await getPlaceAvailability();

      event.target.complete();
    };

    /* Methods */
    const getPlaceAvailability = async() => {
      try {
        const response = await StaffService.tableAvailability();

        store.commit('staff/SET_AVAILABILITY_RATIO', response.data?.availibility_ratio);
      }catch(e) {
        showErrorToast(
            null,
            {
              toggleAvailabilityError: t('dataFetchingError'),
            });
      }
    };


    /* Lifecycle hooks */


    return {
      /* Component properties */
      place,
      availabilityRatio,

      /* Event handlers */
      getPlaceAvailability,
      refresh,

      /* Icons */
    };
  },

};
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}
</style>