<template>
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
        class="w-full h-32 btn-bg-danger"
    >
      {{ $t('occupy') }}
      <ion-icon :icon="removeOutline" class="text-2xl text-white-400"></ion-icon>
    </ion-button>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import {
  IonButton,
  IonIcon,
}                                    from '@ionic/vue';

import { usePlaceManipulation } from '@/composables/usePlaceManipulation';

import {
  removeOutline,
  addOutline,
} from 'ionicons/icons';


export default defineComponent({
  name: 'AvailabilityToggleButtons',
  components: {
    IonButton,
    IonIcon,
  },
  setup() {
    /* Global properties */
    const store = useStore();


    /* Computed properties */
    const availabilityRatio = computed(() => store.getters['staff/availabilityRatio']);
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
    const { toggle } = usePlaceManipulation();


    return {
      /* Component properties */
      isPlaceFull,
      isPlaceEmpty,

      /* Event handlers */
      toggle,

      /* Icons */
      removeOutline,
      addOutline,
    };
  },
});

</script>
<style scoped>
ion-toggle {
  --background-checked: #1F1C2B;
}
</style>
