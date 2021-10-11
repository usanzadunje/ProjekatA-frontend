<template>
  <ion-content :fullscreen="true" scrollY="false">
    <ion-item class="mt-1 bg-transparent text-center" lines="none">
      <ion-button
          v-show="!images"
          @click="selectImages"
          fill="clear"
          color="light"
          class="text-lg uppercase"
      >
        {{ $t('add') }}
        <input
            id="images"
            ref="imagesInput"
            type="file"
            @change="imagesSelected"
            accept="image/png, image/jpeg, image/jpg"
            multiple
        >
      </ion-button>
      <ion-button
          v-show="images"
          @click="uploadImages"
          fill="clear"
          color="light"
          class="text-lg uppercase"
      >
        {{ loading === 1 ? `${$t('saving')}...` : $t('uploadSelectedImages') }}
      </ion-button>
      <ion-button
          @click="removeImage"
          fill="clear"
          color="light"
          class="text-lg uppercase"
          slot="end"
      >
        {{ loading === -1 ? `${$t('removing')}...` : $t('remove') }}
      </ion-button>
      <ion-button @click="dismiss" fill="clear" color="light" slot="end">
        <ion-icon :icon="close" slot="start"></ion-icon>
      </ion-button>
    </ion-item>
    <div class="bg-transparent text-center absolute bottom-6 w-full flex justify-center z-40">
      <ion-button
          :disabled="loading === 0"
          @click="setAsMainImage"
          fill="white"
          expand="block"
          class="text-sm font-bold uppercase main-img-button"
      >
        {{ loading === 0 ? `${$t('setting')}...` : $t('setMain') }}
      </ion-button>
    </div>

    <ImagePreviewModalSlider
        v-if="imagesReady"
        :id="'productImageSlider'"
        :images="productImages"
        @mounted="setSliderRef"
    />
    <div v-show="!imagesReady" class="h-4/5 flex items-center justify-center">
      <div class="snippet" data-title=".dot-pulse">
        <div class="stage">
          <div class="dot-pulse"></div>
        </div>
      </div>
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
  name: 'AddProductImagesModal',
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
    const productImages = ref();
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
    }else {
      imagesReady.value = true;
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

        await ProductService.uploadImages(productId.value, formData);

        showSuccessToast(t('successImageUpload'));

        dismiss();
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
        const imageIndex = await imagePreviewSlider.value.getActiveIndex();
        const imageToRemoveId = productImages.value[imageIndex].id;

        await OwnerService.removePlaceImage(imageToRemoveId);

        showSuccessToast(t('successImageRemove'));

        productImages.value = productImages.value.filter(img => img.id !== imageToRemoveId);
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = null;
      }
    };
    const setAsMainImage = async() => {
      loading.value = 0;
      try {
        const imageIndex = await imagePreviewSlider.value.getActiveIndex();

        await OwnerService.setImageAsMain(productImages.value[imageIndex].id, '?type=App\\Models\\Product');

        showSuccessToast(t('successImageMain'));

        store.dispatch("owner/getProducts");
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = null;
      }
    };
    const setSliderRef = () => {
      imagePreviewSlider.value = document.getElementById('productImageSlider');
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
}

#images {
  display: none;
}

.main-img-button {
  --background: #f4f5f8 !important;
  width: 90%;
  --border-radius: 20px !important;
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