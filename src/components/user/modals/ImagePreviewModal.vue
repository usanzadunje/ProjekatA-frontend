<template>
  <ion-content :fullscreen="true">
    <ion-item class="close-fake text-center" lines="none">
      <ion-button @click="dismiss" fill="clear" color="light" slot="end">
        <ion-icon :icon="close" slot="start"></ion-icon>
      </ion-button>
    </ion-item>

    <ImagePreviewModalSlider
        :images="images"
    />

  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonItem,
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
    IonItem,
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

.close-fake {
  --background: transparent;
  margin-top: 10px;
  margin-bottom: 30px;
}

</style>