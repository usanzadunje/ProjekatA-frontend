<template>
  <div class="p-4 staff-modal-bg">
    <div class="flex justify-center">
      <img
          :src="backendStorageURL + product?.image_path ?? '/places/default_place_product_logo.png'"
          :alt="`Image of product ${product.name}`"
          class="rounded-2xl"
      >
    </div>

    <div class="mt-4">
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11"
      >
        <ion-icon :icon="createOutline" class="mr-2 text-xl text-gray-500"></ion-icon>

        <ion-input
            :placeholder="product?.name"
            type="text"
            disabled
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
      >
        <ion-icon :icon="pricetagOutline" class="mr-2 text-xl text-gray-500"></ion-icon>

        <ion-input
            :placeholder="product?.category"
            type="text"
            disabled
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl mt-3.5"
      >

        <ion-textarea
            :placeholder="product?.description"
            inputmode="text"
            disabled
            :auto-grow="true"
        >
        </ion-textarea>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
      >
        <ion-icon :icon="walletOutline" class="mr-2 text-xl text-gray-500"></ion-icon>

        <ion-input
            :placeholder="product?.price"
            type="number"
            disabled
        ></ion-input>
      </ion-item>
    </div>

    <div class="mt-4">
      <ion-button
          fill="clear"
          @click="$emit('dismiss')"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
      >
        {{ $t('close') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonItem,
  IonInput,
  IonTextarea,
  IonIcon,
  IonButton,
}                          from '@ionic/vue';

import {
  createOutline,
  pricetagOutline,
  walletOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'ShortMenuProductModal',
  components: {
    IonItem,
    IonInput,
    IonTextarea,
    IonIcon,
    IonButton,
  },
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup() {
    /* Global properties */

    /* Component properties */

    /* Composables */


    /* Methods */


    /* Lifecycle hooks */

    /* Event Handlers */


    return {
      /* Component properties */

      /* Event handlers */

      /* Icons */
      createOutline,
      pricetagOutline,
      walletOutline,
    };
  },
});
</script>
<style scoped>
ion-input {
  color: var(--primary-heading) !important;
  --placeholder-opacity: 1 !important;
}

ion-textarea {
  color: var(--primary-heading) !important;
  --placeholder-opacity: 1 !important;
}

img {
  height: 90px;
  width: 90px;
  object-fit: cover;
}
</style>