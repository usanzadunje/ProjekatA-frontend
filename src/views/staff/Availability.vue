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

        <div class="flex justify-between mt-10">
          <ion-button
              @click="toggle(true)"
              :disabled="isPlaceEmpty"
              class="w-full h-32"
          >
            {{ $t('release') }}
            <ion-icon :icon="addOutline" class="text-2xl text-white-400"></ion-icon>
          </ion-button>
          <ion-button
              @click="toggle(false)"
              :disabled="isPlaceFull"
              class="w-full h-32"
          >
            {{ $t('occupy') }}
            <ion-icon :icon="removeOutline" class="text-2xl text-white-400"></ion-icon>
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore }      from 'vuex';
import { useI18n }       from 'vue-i18n';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
}                        from '@ionic/vue';


import StaffService from '@/services/StaffService';
import CafeService  from '@/services/CafeService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  addOutline,
  removeOutline,
} from 'ionicons/icons';

export default {
  name: "Availability",
  components: {
    IonPage,
    IonContent,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
  },
  setup() {
    /* Component properties */
    const store = useStore();
    const availabilityRatio = ref('0/0');
    const place = ref(null);

    /* Computed properties */
    const isPlaceFull = computed(() => {
      const ratio = availabilityRatio.value.split('/');

      //Returned value compares number of tables that are empty to
      //number of tables that are taken and if they are even it
      //returns true indicating place is full with space.
      return ratio[0] === ratio[1];
    });
    const isPlaceEmpty = computed(() => {
      const ratio = availabilityRatio.value.split('/');

      return ratio[0] === '0';
    });

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();


    /* Event handlers */
    const toggle = async(available) => {
      try {
        const response = await StaffService.toggleAvailability(available);

        availabilityRatio.value = response.data?.availability_ratio;
      }catch(e) {
        showErrorToast(
            null,
            {
              toggleAvailabilityError: t('dataFetchingError'),
            });
      }
    };
    const refresh = async(event) => {
      await getPlaceAvailability();

      event.target.complete();
    };

    /* Methods */
    const getPlaceAvailability = async() => {
      try {
        const response = await StaffService.tableAvailability();

        availabilityRatio.value = response.data?.availability_ratio;
      }catch(e) {
        showErrorToast(
            null,
            {
              toggleAvailabilityError: t('dataFetchingError'),
            });
      }
    };
    const getPlace = async() => {
      try {
        const response = await CafeService.show(store.getters['auth/authUser'].cafe);

        place.value = response.data;
        availabilityRatio.value = response.data?.availability_ratio;
      }catch(e) {
        showErrorToast(
            null,
            {
              toggleAvailabilityError: t('dataFetchingError'),
            });
      }
    };

    /* Lifecycle hooks */
    getPlace();
    onIonViewWillEnter(async() => {
      await getPlaceAvailability();
    });


    return {
      /* Component properties */
      place,
      availabilityRatio,
      isPlaceFull,
      isPlaceEmpty,

      /* Event handlers */
      toggle,
      getPlaceAvailability,
      refresh,

      /* Icons */
      addOutline,
      removeOutline,
    };
  },

};
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}
</style>