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
        {{ loading === 0 ? `${$t('setting')}...` : $t('setCover') }}
      </ion-button>
    </div>
    <div class="bg-transparent text-center absolute bottom-20 w-full flex justify-center z-40">
      <ion-button
          :disabled="loading === 0"
          @click="setAsLogo"
          fill="white"
          expand="block"
          class="text-sm font-bold uppercase main-img-button"
      >
        {{ loading === 0 ? `${$t('setting')}...` : $t('setLogo') }}
      </ion-button>
    </div>

    <ImagePreviewModalSlider
        :id="'placeImageSlider'"
        :images="place.images"
    />
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

import {
  close,
  add,
  remove,
} from 'ionicons/icons';

export default defineComponent({
  name: 'AddPlaceImageModal',
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
    const place = computed(() => store.getters['staff/place']);

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { t } = useI18n();

    /* Lifecycle hooks */
    onMounted(() => {
      imagePreviewSlider.value = document.getElementById('placeImageSlider');
    });
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

        await OwnerService.uploadPlaceImages(formData);

        showSuccessToast(t('successImageUpload'));

        dismiss();

        await store.dispatch('staff/getPlaceInfo');
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

        await OwnerService.removePlaceImage(place.value.images[imageIndex].id);

        showSuccessToast(t('successImageRemove'));

        await store.dispatch('staff/getPlaceInfo');
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

        await OwnerService.setImageAsMain(place.value.images[imageIndex].id);

        showSuccessToast(t('successImageMain'));

        await store.dispatch('staff/getPlaceInfo');
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = null;
      }
    };
    const setAsLogo = async() => {
      loading.value = 0;
      try {
        const imageIndex = await imagePreviewSlider.value.getActiveIndex();

        await OwnerService.setImageAsLogo(place.value.images[imageIndex].id);

        showSuccessToast(t('successImageLogo'));

        await store.dispatch('staff/getPlaceInfo');
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = null;
      }
    };

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
}

#images {
  display: none;
}

.main-img-button {
  --background: #f4f5f8 !important;
  width: 90%;
  --border-radius: 20px !important;
}
</style>