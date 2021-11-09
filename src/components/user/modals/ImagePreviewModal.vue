<template>
  <ion-content scrollY="false">
    <div class="safe-area z-40">
      <ion-button @click="dismiss" fill="clear" color="light">
        <ion-icon :icon="close" slot="icon-only"></ion-icon>
      </ion-button>
    </div>

    <ImagePreviewModalSlider
        :images="images"
    />
  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonIcon,
  IonButton,
  modalController,
}                          from '@ionic/vue';

import ImagePreviewModalSlider from '@/components/ImagePreviewModalSlider';

import {
  close,
} from 'ionicons/icons';

export default defineComponent({
  name: 'ImagePreviewModal',
  components: {
    IonContent,
    IonIcon,
    IonButton,
    ImagePreviewModalSlider,
  },
  props: {
    images: {
      type: Object,
      default: null,
    },
  },
  setup() {
    /* Component properties */


    /* Lifecycle hooks */

    /* Event handlers */

    const dismiss = () => {
      modalController.dismiss();
    };

    return {
      /* Component properties */


      /* Event handlers */
      dismiss,

      /* Icons */
      close,
    };
  },
});
</script>

<style scoped>
ion-content {
  --background: rgba(44, 39, 45, 0.84);
}

ion-icon {
  font-size: 2rem;
}

ion-button {
  margin: 0;
  --padding-top: 8px;
  --padding-end: 8px;
}

ion-button::part(native) {
  height: auto !important;
}

.safe-area {
  position: absolute;
  top: var(--ion-safe-area-top, 0);
  right: var(--ion-safe-area-right, 0);;
}
</style>