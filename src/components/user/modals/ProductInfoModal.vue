<template>
  <div class="p-4 staff-modal-bg">
    <MainImagePreview
        :path="mainImagePath"
        :label="$t('gallery', 2)"
        @click="openPreview(product.images)"
    />

    <div class="mt-4">
      <ion-item
          lines="none"
          class="rounded-2xl h-11"
      >
        <ion-icon
            slot="start"
            :icon="createOutline"
            class="mr-2 text-xl text-gray-500"
        ></ion-icon>

        <ion-input
            :placeholder="product?.name"
            type="text"
            disabled
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="rounded-2xl h-11 mt-3.5"
      >
        <ion-icon
            slot="start"
            :icon="pricetagOutline"
            class="mr-2 text-xl text-gray-500"
        ></ion-icon>

        <ion-input
            :placeholder="product?.category"
            type="text"
            disabled
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="rounded-2xl mt-3.5"
      >
        <p>
          {{ product?.description || $t('noProductDescription') }}
        </p>
      </ion-item>
      <ion-item
          lines="none"
          class="rounded-2xl h-11 mt-3.5"
      >
        <ion-icon
            slot="start"
            :icon="walletOutline"
            class="mr-2 text-xl text-gray-500"
        ></ion-icon>

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
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
          @click="$emit('dismiss')"
      >
        {{ $t('close') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, toRefs } from 'vue';
import {
  IonItem,
  IonInput,
  IonIcon,
  IonButton, modalController,
}                                            from '@ionic/vue';

import MainImagePreview  from '@/components/MainImagePreview';
import ImagePreviewModal from '@/components/user/modals/ImagePreviewModal';

import {
  createOutline,
  pricetagOutline,
  walletOutline,
} from 'ionicons/icons';


export default defineComponent({
  name: 'ProductInfoModal',
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    MainImagePreview,
  },
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props) {
    /* Global properties */

    /* Component properties */
    const { product } = toRefs(props);
    const mainImagePath = computed(() => {
      if(product.value.images?.length > 0) {
        return product.value.images?.find(image => image.is_main)?.path ??
            product.value.images[0]?.path;
      }else {
        return '/places/image_placeholder.png';
      }
    });
    /* Lifecycle hooks */

    /* Composables */


    /* Methods */


    /* Event Handlers */
    const openPreview = async(images) => {
      const modal = await modalController
          .create({
            component: ImagePreviewModal,
            cssClass: 'custom-gallery-modal',
            componentProps: {
              images,
            },
          });
      return modal.present();
    };

    return {
      /* Component properties */
      mainImagePath,

      /* Event handlers */
      openPreview,

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

p {
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--primary-heading) !important;
  opacity: 0.4;
  padding: 10px 0;
}

img {
  height: 90px;
  width: 90px;
  object-fit: cover;
}
</style>