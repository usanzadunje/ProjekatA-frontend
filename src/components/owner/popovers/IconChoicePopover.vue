<template>
  <ion-content class="ion-no-padding" :scrollY="false">
    <div class="pb-2">
      <div class="pt-2 pb-4">
        <h1 class="secondary-heading text-center">{{ $t('chooseIcon') }}</h1>
      </div>
      <div
          v-for="(icon, name, index) in icons"
          :key="index"
          class="p-2 inline-block"
      >
        <ion-button
            fill="clear"
            slot="icon-only"
            class="reset-button-size"
            @click="chooseIcon(name)"
        >
          <ion-icon
              slot="icon-only"
              :icon="icon"
              class="text-2xl text-gray-500"
          ></ion-icon>
        </ion-button>
      </div>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonButton,
  IonIcon,
  popoverController,
}                          from '@ionic/vue';

export default defineComponent({
  name: 'IconChoicePopover',
  components: {
    IonContent,
    IonButton,
    IonIcon,
  },
  props: {
    icons: {
      type: Object,
      default: null,
      required: true,
    },
  },
  setup() {
    /* Global properties */
    /* Component properties */

    /* Event handlers */
    const chooseIcon = (icon) => {
      popoverController.dismiss({ icon });
    };
    return {
      /* Component properties */

      /* Event handlers */
      chooseIcon,

      /* Icons */
    };
  },
});
</script>
<style scoped>
ion-content {
  --background: var(--input-bg) !important;
  background: var(--input-bg) !important;
}
</style>