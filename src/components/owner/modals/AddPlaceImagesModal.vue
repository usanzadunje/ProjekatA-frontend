<template>
  <ion-content :fullscreen="true">
    <ion-item class="close-fake text-center" lines="none">
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
        {{ loading ? `${$t('uploading')}...` : $t('uploadSelectedImages') }}
      </ion-button>
      <ion-button @click="dismiss" fill="clear" color="light" slot="end">
        <ion-icon :icon="close" slot="start"></ion-icon>
      </ion-button>
    </ion-item>


    <ion-slides v-update-swiper :options="slideOpts">
      <ion-slide v-for="image in place.images" :key="image.id">
        <!--        OVDE NEGDE UBACITI DUGME ZA REMOVE SLIKE I PROSLEDITI ID SLIKE-->
        <!--    <ion-button fill="clear" color="light" class="text-lg uppercase">-->
        <!--      {{ $t('remove') }}-->
        <!--    </ion-button>-->
        <div class="swiper-zoom-container">
          <img
              :src="`${backendStorageURL + image.path}`"
              :alt="`Image of place ${place.name}`"
              @dblclick="zoom(userClickedToZoom)"
          >
        </div>
      </ion-slide>
    </ion-slides>
  </ion-content>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useStore }                       from 'vuex';
import { useI18n }                        from 'vue-i18n';
import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonSlides,
  IonSlide,
  modalController,
}                                         from '@ionic/vue';

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
    IonSlides,
    IonSlide,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const imagePreviewSlider = ref(null);
    const slideOpts = {
      zoom: {
        maxRatio: 2,
      },
    };
    const userClickedToZoom = ref(true);
    const imagesInput = ref();
    const images = ref();
    const loading = ref(false);
    const place = computed(() => store.getters['staff/place']);

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    /* Lifecycle hooks */

    /* Event handlers */
    const zoom = async(zoomIn) => {
      let swiper = await imagePreviewSlider?.value?.$el.getSwiper();
      if(zoomIn) {
        swiper.zoom.in();
      }else {
        swiper.zoom.out();
      }
      userClickedToZoom.value = !userClickedToZoom.value;
    };
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
      loading.value = true;
      if(!images.value) {
        showErrorToast(
            null,
            {
              noImageSelected: t('owner.noImage'),
            },
        );
        loading.value = false;
        return;
      }

      try {
        const formData = new FormData;

        for(let i = 0; i < images.value.length; i++) {
          formData.append(`images[${i}]`, images.value[i]);
        }

        await OwnerService.uploadPlaceImages(formData);

        showSuccessToast(t('successImageUpload'));
        loading.value = false;

        await store.dispatch('staff/getPlaceInfo');

        dismiss();
      }catch(errors) {
        await showErrorToast(errors);
        loading.value = false;
      }
    };

    return {
      /* Component properties */
      imagePreviewSlider,
      slideOpts,
      userClickedToZoom,
      imagesInput,
      images,
      loading,
      place,

      /* Event handlers */
      zoom,
      dismiss,
      selectImages,
      imagesSelected,
      uploadImages,

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

ion-slides {
  height: 80%;
}

.close-fake {
  --background: transparent;
  margin-top: 10px;
  margin-bottom: 30px;
}

#images {
  display: none;
}
</style>