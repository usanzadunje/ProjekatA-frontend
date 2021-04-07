<template>
  <div class="px-4 py-3">
    <p v-if="hasTitle" class="sliding-filter-title uppercase">FILTERI</p>
    <ion-button
        class="sliding-filter-button sliding-filter-button-text h-9 w-32 uppercase"
        :class="activeSlidingButton === 'location' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
        data-sliding-filter="location"
        @click="buttonActivated"
    >
      Najblizi vama
      <ion-icon slot="start"
                :icon="activeSlidingButton === 'location' ? locationOutline : locationInactiveOutline"></ion-icon>
    </ion-button>
    <ion-button
        class="sliding-filter-button sliding-filter-button-text h-9 w-28 uppercase"
        :class="activeSlidingButton === 'free' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
        data-sliding-filter="free"
        @click="buttonActivated"
    >
      SLOBODNI
      <ion-icon slot="start"
                :icon="activeSlidingButton === 'free' ? graphSliceOutline : graphSliceInactiveOutline"></ion-icon>
    </ion-button>
    <ion-button
        class="sliding-filter-button sliding-filter-button-text h-9 w-20 uppercase"
        :class="activeSlidingButton === 'food' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
        data-sliding-filter="food"
        @click="buttonActivated"
    >
      HRANA
      <ion-icon slot="start"
                :icon="activeSlidingButton === 'food' ? graphSliceOutline : graphSliceInactiveOutline"></ion-icon>
    </ion-button>
    <ion-button
        class="sliding-filter-button sliding-filter-button-text h-9 w-28 uppercase"
        :class="activeSlidingButton === 'popular' ? 'sliding-filter-button-active' : 'sliding-filter-button-inactive'"
        data-sliding-filter="popular"
        @click="buttonActivated"
    >
      POPULARNO
      <ion-icon slot="start"
                :icon="activeSlidingButton === 'popular' ? graphSliceOutline : graphSliceInactiveOutline"></ion-icon>
    </ion-button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonIcon, IonButton }   from '@ionic/vue';
import {
  locationOutline,
  locationInactiveOutline,
  graphSliceOutline,
  graphSliceInactiveOutline,
}                               from '@/assets/icons';

export default defineComponent({
  name: 'SlidingFilter',
  components: {
    IonIcon,
    IonButton,
  },
  props: {
    hasTitle: Boolean,
  },
  setup() {
    /* Properties */
    let activeSlidingButton = ref('location');

    /* Event listeners */
    const buttonActivated = (event) => {
      activeSlidingButton.value = event.target.dataset.slidingFilter;
    };

    return {
      /* Properties */
      activeSlidingButton,

      /* Event listeners */
      buttonActivated,

      /* Icons */
      locationOutline,
      locationInactiveOutline,
      graphSliceOutline,
      graphSliceInactiveOutline,
    };
  },
});
</script>
<style scoped>
ion-button {
  --background-activated: #207DFF;
}
</style>