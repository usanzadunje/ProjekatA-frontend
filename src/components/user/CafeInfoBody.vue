<template>
  <ion-item class="ion-item-no-padding-x mt-2 md margin-top-reset">
    <ion-icon :icon="pieChart" class="mr-2 text-yellow-400"></ion-icon>
    <span class="modal-cafe-text-medium mt-0.5 lowercase">{{ cafe.taken_capacity }} - {{ $t('free') }}</span>
  </ion-item>
  <hr class="card-horizontal-ruler mt-1">
  <ion-item class="ion-item-no-padding-x">
    <div class="flex">
      <ion-icon :icon="locationOutline" class="mr-2 primary-icon-color"></ion-icon>
      <p class="modal-cafe-text-regular">{{ cafe.address }} - {{ cafe.city }}</p>
    </div>
    <ion-button @click="openModal(true)" fill="clear" class="uppercase font-bold" slot="end">{{
        $t('map')
                                                                                             }}
    </ion-button>
  </ion-item>
  <hr class="card-horizontal-ruler">
  <div class="flex justify-start mt-3.5">
    <div class="ion-item-no-padding-x flex">
      <ion-icon :icon="fastFoodOutline" class="mr-2 primary-icon-color"></ion-icon>
      <p class="modal-cafe-text-regular lowercase">{{ $t('food') }}</p>
    </div>
    <div class="ion-item-no-padding-x flex ml-3.5">
      <ion-icon :icon="leafOutline" class="mr-2 primary-icon-color"></ion-icon>
      <p class="modal-cafe-text-regular lowercase">{{ $t('has') }} {{ $t('garden') }}</p>
    </div>
    <div class="ion-item-no-padding-x flex ml-3.5">
      <ion-icon :icon="timeOutline" class="mr-2 primary-icon-color"></ion-icon>
      <p class="modal-cafe-text-regular">09am-01pm</p>
    </div>
  </div>
  <hr class="card-horizontal-ruler mt-3.5">
  <ion-modal
      :is-open="isModalOpen"
      css-class="custom-map-modal"
      @didDismiss="openModal(false);"
      :backdrop-dismiss="true"
      :swipe-to-close="true"
  >
    <GoogleMap :cafe="cafe"/>
  </ion-modal>
</template>

<script>
import { defineComponent, ref } from 'vue';

import {
  IonIcon,
  IonButton,
  IonItem,
  IonModal,
} from '@ionic/vue';

import {
  pieChart,
  locationOutline,
  leafOutline,
  fastFoodOutline,
  timeOutline,

}
  from 'ionicons/icons';

import GoogleMap from '@/components/user/GoogleMap';

export default defineComponent({
  name: "CafeInfoBody",
  components: {
    IonIcon,
    IonButton,
    IonItem,
    IonModal,
    GoogleMap,
  },
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const isModalOpen = ref(false);

    /* Event handlers */
    const openModal = (state) => {
      isModalOpen.value = state;
    };

    return {
      /* Component properties */
      isModalOpen,
      /* Event handlers */
      openModal,

      /* Icons from */
      pieChart,
      locationOutline,
      fastFoodOutline,
      leafOutline,
      timeOutline,
    };
  },

});
</script>
<style scoped>
ion-item {
  --border-style: none;
}

ion-button {
  font-size: 0.7rem !important;
}
</style>