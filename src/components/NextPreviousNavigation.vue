<template>
  <div class="w-full flex flex-col items-center">
    <div class="flex items-center mb-2">
      <ion-button
          fill="clear"
          class="reset-button-size user-selected-color uppercase underline"
          @click="$emit('goToToday')"
      >
        {{ $t('today') }}
      </ion-button>
    </div>
    <div class="w-full flex justify-between">
      <ion-button
          fill="clear"
          class="reset-button-size"
          @click="$emit('previous')"
      >
        <ion-icon
            slot="icon-only"
            :icon="chevronBack"
            class="primary-text-color"
        ></ion-icon>
      </ion-button>

      <slot></slot>

      <ion-button
          fill="clear"
          class="reset-button-size"
          @click="$emit('next')"
      >
        <ion-icon
            slot="icon-only"
            :icon="chevronForward"
            class="primary-text-color"
        ></ion-icon>
      </ion-button>
    </div>

  </div>
</template>
<script>

import { defineComponent }    from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';

import {
  chevronForward,
  chevronBack,
} from 'ionicons/icons';

export default defineComponent({
  name: 'NextPreviousNavigation',
  components: {
    IonButton,
    IonIcon,
  },
  props: {
    label: {
      type: String,
      default: null,
    },
  },
  emits: ['next', 'previous', 'goToToday'],
  setup() {
    /* Global properties */
    /* Component properties */
    /* Composables */
    /* Event handlers */

    return {
      /* Component properties */
      /* Event handlers */
      /* Icons */
      chevronForward,
      chevronBack,
    };
  },
});
</script>
<style scoped>
</style>