<template>
  <ion-content :fullscreen="true" scrollY="false">
    <div class="absolute top-0 z-40 w-full">
      <ion-item class="mt-1 bg-transparent text-center" lines="none">
        <ion-button
            v-show="!images"
            fill="clear"
            color="light"
            class="text-lg uppercase"
            @click="selectImages"
        >
          {{ $t('add') }}
          <input
              ref="imagesInput"
              id="images"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              @change="imagesSelected"
          >
        </ion-button>
        <ion-button
            v-show="images"
            fill="clear"
            color="light"
            class="text-lg uppercase"
            @click="uploadImages"
        >
          {{ loading === 1 ? `${$t('saving')}...` : $t('uploadSelectedImages') }}
        </ion-button>
        <ion-button
            id="removeButton"
            fill="clear"
            color="light"
            slot="end"
            :disabled="!imagesReady || productImages?.length === 0"
            class="text-lg uppercase"
            @click="removeImage"
        >
          {{ loading === -1 ? `${$t('removing')}...` : $t('remove') }}
        </ion-button>
        <ion-button @click="dismiss" fill="clear" color="light" slot="end">
          <ion-icon :icon="close" slot="start"></ion-icon>
        </ion-button>
      </ion-item>
    </div>

    <ImagePreviewModalSlider
        v-if="imagesReady"
        :id="'productImageSlider'"
        :images="productImages"
        @mounted="setSliderRef"
        @updated="setSliderRef"
    />
    <div v-show="!imagesReady" class="h-full flex items-center justify-center">
      <div class="snippet" data-title=".dot-pulse">
        <div class="stage">
          <div class="dot-pulse"></div>
        </div>
      </div>
    </div>

    <div class="bg-transparent text-center absolute bottom-6 w-full flex justify-center z-40">
      <ion-button
          :disabled="loading === 0 || productImages?.length === 0"
          fill="white"
          expand="block"
          class="text-sm font-bold uppercase main-img-button"
          @click="setAsMainImage"
      >
        {{ loading === 0 ? `${$t('setting')}...` : $t('setCover') }}
      </ion-button>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent, ref, toRefs } from 'vue';
import { useStore }                     from 'vuex';
import { useI18n }                      from 'vue-i18n';
import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  modalController,
}                                       from '@ionic/vue';

import ImagePreviewModalSlider from '@/components/ImagePreviewModalSlider';

import OwnerService   from '@/services/OwnerService';
import ProductService from '@/services/ProductService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  close,
  add,
  remove,
} from 'ionicons/icons';

export default defineComponent({
  name: 'ProductImagesAddModal',
  components: {
    IonContent,
    IonItem,
    IonIcon,
    IonButton,
    ImagePreviewModalSlider,
  },
  props: {
    productId: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const imagePreviewSlider = ref();
    const { productId } = toRefs(props);
    const productImages = ref([]);
    const imagesInput = ref();
    const images = ref();
    const loading = ref();
    const imagesReady = ref(false);

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { t } = useI18n();

    /* Lifecycle hooks */
    if(productId.value) {
      ProductService.images(productId.value)
                    .then((response) => {
                      productImages.value = response.data;
                      imagesReady.value = true;
                    })
                    .catch(() => {
                      productImages.value = null;
                    });
    }

    /* Event handlers */
    const dismiss = () => {
      modalController.dismiss();
    };
    const selectImages = () => {
      imagesInput.value.click();
    };
    const imagesSelected = () => {
      images.value = imagesInput.value.files;
    };
    const uploadImages = async() => {
      loading.value = 1;
      if(!images.value) {
        showErrorToast(
            null,
            {
              noImageSelected: t('owner.noImage'),
            },
        );
        loading.value = null;
        return;
      }

      try {
        const formData = new FormData;

        for(let i = 0; i < images.value.length; i++) {
          formData.append(`images[${i}]`, images.value[i]);
        }

        const response = await ProductService.uploadImages(productId.value, formData);

        productImages.value = productImages.value.concat(response.data);

        showSuccessToast(t('successImageUpload'));
      }catch(errors) {
        images.value = null;

        await showErrorToast(errors);
      }finally {
        loading.value = null;
      }
    };
    const removeImage = async() => {
      loading.value = -1;
      try {
        const imageIndex = imagePreviewSlider.value.activeIndex;
        const image = productImages.value[imageIndex];

        await OwnerService.removePlaceImage(image.id);

        if(image.is_main) {
          store.commit('owner/REMOVE_PRODUCT_MAIN_IMAGE', productId.value);
        }

        productImages.value = productImages.value.filter(img => img.id !== image.id);

        showSuccessToast(t('successImageRemove'));
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = null;
      }
    };
    const setAsMainImage = async() => {
      loading.value = 0;
      try {
        const imageIndex = imagePreviewSlider.value.activeIndex;
        const image = productImages.value[imageIndex];

        await store.dispatch('owner/setPlaceImageType', {
          id: image.id,
          type: 'is_main',
          product: true,
        });

        store.commit('owner/SET_NEW_PRODUCT_IMAGE_AS_MAIN', {
          productId: productId.value,
          image,
        });

        showSuccessToast(t('successImageMain'));
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = null;
      }
    };
    const setSliderRef = () => {
      if(!imagePreviewSlider.value || imagePreviewSlider.value.destroyed) {
        imagePreviewSlider.value = document.getElementById('productImageSlider')?.swiper;
      }
    };

    /* Watchers */

    return {
      /* Component properties */
      productImages,
      imagesInput,
      images,
      loading,
      imagesReady,

      /* Event handlers */
      dismiss,
      selectImages,
      imagesSelected,
      uploadImages,
      removeImage,
      setAsMainImage,
      setSliderRef,

      /* Icons */
      close,
      add,
      remove,
    };
  },
})
;
</script>

<style scoped>
ion-content {
  --background: rgba(44, 39, 45, 0.84);
}

ion-icon {
  font-size: 2rem;
  margin: 0;
}

#images {
  display: none;
}

.main-img-button {
  --background: #f4f5f8 !important;
  width: 90%;
  --border-radius: 20px !important;
}

ion-button {
  margin: 0;
}

#removeButton {
  margin-right: 1rem !important;
}

.dot-pulse {
  position: relative;
  left: -9999px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #f4f5f8;
  color: #f4f5f8;
  box-shadow: 9999px 0 0 -5px #f4f5f8;
  animation: dotPulse 1.5s infinite linear;
  animation-delay: .25s;
}

.dot-pulse::before, .dot-pulse::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #f4f5f8;
  color: #f4f5f8;
}

.dot-pulse::before {
  box-shadow: 9984px 0 0 -5px #f4f5f8;
  animation: dotPulseBefore 1.5s infinite linear;
  animation-delay: 0s;
}

.dot-pulse::after {
  box-shadow: 10014px 0 0 -5px #f4f5f8;
  animation: dotPulseAfter 1.5s infinite linear;
  animation-delay: .5s;
}

@keyframes dotPulseBefore {
  0% {
    box-shadow: 9984px 0 0 -5px #f4f5f8;
  }
  30% {
    box-shadow: 9984px 0 0 2px #f4f5f8;
  }
  60%,
  100% {
    box-shadow: 9984px 0 0 -5px #f4f5f8;
  }
}

@keyframes dotPulse {
  0% {
    box-shadow: 9999px 0 0 -5px #f4f5f8;
  }
  30% {
    box-shadow: 9999px 0 0 2px #f4f5f8;
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -5px #f4f5f8;
  }
}

@keyframes dotPulseAfter {
  0% {
    box-shadow: 10014px 0 0 -5px #f4f5f8;
  }
  30% {
    box-shadow: 10014px 0 0 2px #f4f5f8;
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px #f4f5f8;
  }
}

</style>