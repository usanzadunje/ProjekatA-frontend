<template>
  <div class="flex justify-between mt-10">
    <ion-button
        :disabled="isPlaceEmpty || toggling"
        class="w-full h-32 btn-bg-empty"
        @click="randomToggle(true)"
    >
      {{ toggling ? `${$t('toggling')}...` : $t('release') }}
      <ion-icon
          v-show="!toggling"
          :icon="addOutline"
          class="text-2xl text-white-400"
      ></ion-icon>
    </ion-button>
    <ion-button
        :disabled="isPlaceFull || toggling"
        class="w-full h-32 btn-bg-danger"
        @click="randomToggle(false)"
    >
      {{ toggling ? `${$t('toggling')}...` : $t('occupy') }}
      <ion-icon
          v-show="!toggling"
          :icon="removeOutline"
          class="text-2xl text-white-400"
      ></ion-icon>
    </ion-button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonButton,
  IonIcon,
}                          from '@ionic/vue';

import { usePlaceManipulation } from '@/composables/usePlaceManipulation';

import {
  removeOutline,
  addOutline,
} from 'ionicons/icons';


export default defineComponent({
  name: 'StaffAvailabilityToggleButtons',
  components: {
    IonButton,
    IonIcon,
  },
  setup() {
    /* Global properties */

    /* Computed properties */
    /* Composables */
    const { isPlaceFull, isPlaceEmpty, randomToggle, toggling } = usePlaceManipulation();


    return {
      /* Component properties */
      isPlaceFull,
      isPlaceEmpty,
      toggling,

      /* Event handlers */
      randomToggle,

      /* Icons */
      removeOutline,
      addOutline,
    };
  },
});

</script>
<style scoped>

</style>
