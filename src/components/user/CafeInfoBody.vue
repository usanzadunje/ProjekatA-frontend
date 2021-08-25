<template>
  <div class="flex justify-start items-center py-2 ion-item-no-padding-x mt-2 ">
    <ion-icon :icon="pieChart" class="mr-2 text-yellow-400" style="font-size: 25px"></ion-icon>
    <span class="modal-cafe-text-medium lowercase">{{ cafe.availability_ratio }} - {{ $t('free') }}</span>
  </div>
  <hr class="card-horizontal-ruler mt-1">
  <div class="flex justify-between items-center">
    <div class="flex">
      <ion-icon :icon="locationOutline" class="flex-shrink-0 mr-2 primary-icon-color"></ion-icon>
      <p class="modal-cafe-text-regular">{{ cafe.address }} - {{ cafe.city }}</p>
    </div>
    <ion-button @click="openModal(true)" fill="clear" class="uppercase font-bold">
      {{ $t('map') }}
    </ion-button>
  </div>
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
import { defineComponent } from 'vue';

import {
  IonIcon,
  IonButton,
  IonModal,
} from '@ionic/vue';

import GoogleMap from '@/components/user/GoogleMap';

import { useModal } from '@/composables/useModal';

import {
  pieChart,
  locationOutline,
  leafOutline,
  fastFoodOutline,
  timeOutline,

}
  from 'ionicons/icons';

export default defineComponent({
  name: "CafeInfoBody",
  components: {
    IonIcon,
    IonButton,
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

    /* Composables */
    const { isModalOpen, openModal } = useModal();


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