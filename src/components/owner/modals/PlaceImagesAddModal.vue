<template>
  <ion-content scrollY="false">
    <div class="relative h-full">
      <div class="absolute safe-area-positioning z-40 w-full">
        <ion-item class="mt-1 bg-transparent text-center" lines="none">
          <ion-button
              v-show="!images"
              fill="clear"
              class="text-lg uppercase light-color"
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
              class="text-lg uppercase light-color"
              @click="uploadImages"
          >
            {{ loading === 1 ? `${$t('saving')}...` : $t('uploadSelectedImages') }}
          </ion-button>
          <ion-button
              id="removeButton"
              fill="clear"
              slot="end"
              :disabled="place.images?.length === 0 || loading === -1"
              class="text-lg uppercase light-color"
              @click="removeImage"
          >
            {{ loading === -1 ? `${$t('removing')}...` : $t('remove') }}
          </ion-button>
          <ion-button @click="dismiss" fill="clear" class="light-color" slot="end">
            <ion-icon :icon="close" slot="start"></ion-icon>
          </ion-button>
        </ion-item>
      </div>

      <ImagePreviewModalSlider
          :id="'placeImageSlider'"
          :images="place.images"
          @updated="setSliderRef"
          @add-images="selectImages"
      />

      <div
          v-show="place.images.length > 0"
      >
        <div class="bg-transparent text-center absolute bottom-7 w-full flex justify-center z-40">
          <ion-button
              :disabled="loading === 0 || place.images?.length === 0"
              fill="white"
              expand="block"
              class="text-xs 2xs:text-sm font-bold uppercase main-img-button"
              @click="setAsMainImage"
          >
            {{ loading === 0 ? `${$t('setting')}...` : $t('setCover') }}
          </ion-button>
        </div>
        <div class="bg-transparent text-center absolute bottom-20 w-full flex justify-center z-40">
          <ion-button
              :disabled="loading === 0 || place.images?.length === 0"
              fill="white"
              expand="block"
              class="text-sm font-bold uppercase main-img-button"
              @click="setAsLogo"
          >
            {{ loading === 0 ? `${$t('setting')}...` : $t('setLogo') }}
          </ion-button>
        </div>
      </div>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore }                                  from 'vuex';
import { useI18n }                                   from 'vue-i18n';
import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  modalController,
}                                                    from '@ionic/vue';

import ImagePreviewModalSlider from '@/components/ImagePreviewModalSlider';

import OwnerService from '@/services/OwnerService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useErrorHandling }      from '@/composables/useErrorHandling';

import {
  close,
  add,
  remove,
} from 'ionicons/icons';

export default defineComponent({
  name: 'PlaceImagesAddModal',
  components: {
    IonContent,
    IonItem,
    IonIcon,
    IonButton,
    ImagePreviewModalSlider,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const imagePreviewSlider = ref();
    const imagesInput = ref();
    const images = ref();
    const loading = ref();
    const place = computed(() => store.getters['owner/place']);

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const { tryCatch } = useErrorHandling();

    /* Methods */
    const setSliderRef = () => {
      if(!imagePreviewSlider.value) {
        imagePreviewSlider.value = document.getElementById('placeImageSlider')?.swiper;
      }
    };

    /* Lifecycle hooks */
    onMounted(() => {
      setSliderRef();
    });

    /* Event handlers */
    const dismiss = () => {
      modalController.dismiss();
    };
    const selectImages = () => {
      imagesInput.value.click();
    };
    const imagesSelected = () => {
      console.log('changed', imagesInput.value.files);
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

      await tryCatch(
          async() => {
            const formData = new FormData;

            for(let i = 0; i < images.value.length; i++) {
              formData.append(`images[${i}]`, images.value[i]);
            }

            await store.dispatch('owner/uploadPlaceImages', formData);

          },
          {
            successMessageKey: 'successImageUpload',
          },
      );

      images.value = null;
      loading.value = null;
    };
    const removeImage = async() => {
      if(loading.value === -1) {
        return;
      }

      loading.value = -1;

      await tryCatch(
          async() => {
            const imageIndex = imagePreviewSlider.value.activeIndex;

            await OwnerService.removePlaceImage(place.value.images[imageIndex].id);

            await store.dispatch('owner/getPlaceInfo');

            if(place.value.images <= 0) {
              imagePreviewSlider.value = document.getElementById('placeImageSlider')?.swiper;
            }
          },
          {
            successMessageKey: 'successImageRemove',
          },
      );

      loading.value = null;
    };
    const setAsMainImage = async() => {
      loading.value = 0;

      await tryCatch(
          async() => {
            const imageIndex = imagePreviewSlider.value.activeIndex;

            await store.dispatch('owner/setPlaceImageType', {
              id: place.value.images[imageIndex].id,
              type: 'is_main',
            });
          },
          {
            successMessageKey: 'successImageMain',
          },
      );

      loading.value = null;
    };
    const setAsLogo = async() => {
      loading.value = 0;

      await tryCatch(
          async() => {
            const imageIndex = imagePreviewSlider.value.activeIndex;

            await store.dispatch('owner/setPlaceImageType', {
              id: place.value.images[imageIndex].id,
              type: 'is_logo',
            });
          },
          {
            successMessageKey: 'successImageLogo',
          },
      );

      loading.value = null;
    };

    /* Watchers */

    return {
      /* Component properties */
      imagesInput,
      images,
      loading,
      place,

      /* Event handlers */
      dismiss,
      selectImages,
      imagesSelected,
      uploadImages,
      removeImage,
      setAsMainImage,
      setAsLogo,
      setSliderRef,

      /* Icons */
      close,
      add,
      remove,
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

.safe-area-positioning {
  top: var(--ion-safe-area-top, 0);
}
</style>