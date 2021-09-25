<template>
  <div class="px-4 pt-4">
    <div class="ion-item-no-padding-x flex items-center">
      <img
          :src="mainImagePath"
          :alt="`Logo of ${place.name}`"
          class="modal-thumbnail radius-11px"
      >
      <div class="ml-4">
        <h1 class="modal-cafe-name-text">{{ place.name }}</h1>
        <p class="modal-cafe-offers">Kafic, hrana, basta...</p>
      </div>
    </div>

    <CafeInfoBody :place="place"/>
    <div class="mt-6 ion-no-padding">
      <ion-slides v-update-swiper :options="slideOpts">
        <ion-slide v-for="image in place.images?.filter(img => img.is_main !== 1)" :key="image?.id">
          <img
              :src="`${backendStorageURL + image?.path}`"
              :alt="`Image of ${place.name}`"
              @click="openPreview(place)"
              class="object-cover slider-images"
          >
        </ion-slide>
      </ion-slides>
    </div>

    <div class="mt-5 mb-3 flex justify-around">
      <ion-button
          class="flex-shrink mr-2.5 uppercase button-see-more modal-button-border"
          :routerLink="`/cafes/${place.id}?redirect=${$route.path + '?openModal=true'}`"
          @click="$emit('dismissShortCafeModal')"
      >
        {{ $t('more') }}
      </ion-button>
      <ion-button
          class="flex-shrink uppercase button-subscribe modal-button-border"
          @click="openModal(true);$emit('subModalOpened');"
          :disabled="isSubButtonDisabled"
      >
        <ion-icon slot="start"
                  :icon="isUserSubscribed ? notifications : notificationsOutline"
        >

        </ion-icon>
        {{ isUserSubscribed ? $t('subscribed') : $t('subscribe') }}
      </ion-button>
    </div>
  </div>
  <Modal
      :is-open="isModalOpen"
      css-class="custom-map-modal"
      @didDismiss="openModal(false);$emit('dismissShortCafeModal')"
  >
    <CafeSubscriptionModal
        :cafe="{'id': place.id, 'name': place.name}"
        @dismiss-subscription-modal="openModal(false);"
        @user-toggled-subscription="$emit('userToggledSubscription')"
    />
  </Modal>
</template>

<script>
import { defineComponent, ref, toRef, onUnmounted } from 'vue';
import { useRoute, useRouter }                      from 'vue-router';
import { useStore }                                 from 'vuex';
import { Capacitor }                                from '@capacitor/core';
import {
  IonIcon,
  IonButton,
  IonSlides,
  IonSlide,
  modalController,
}                                                   from '@ionic/vue';

import CafeInfoBody          from '@/components/place/CafeInfoBody';
import Modal                 from '@/components/Modal';
import CafeSubscriptionModal from '@/components/user/modals/CafeSubscriptionModal';
import ImagePreviewModal     from '@/components/user/modals/ImagePreviewModal';

import CafeService from '@/services/CafeService';

import { useModal } from '@/composables/useModal';

import {
  notifications,
  notificationsOutline,

} from 'ionicons/icons';

export default defineComponent({
  name: 'ShortCafeModal',
  components: {
    IonIcon,
    IonButton,
    IonSlides,
    IonSlide,
    Modal,
    CafeSubscriptionModal,
    CafeInfoBody,
  },
  props: {
    place: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismissShortCafeModal', 'subModalOpened', 'userToggledSubscription'],
  setup(props) {
    /* Global properties and methods */
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    /* Component properties */
    const slideOpts = {
      slidesPerView: 2.5,
      spaceBetween: 10,
    };
    const isUserSubscribed = ref(false);
    const place = toRef(props, 'place');
    const isSubButtonDisabled = ref(true);
    const mainImagePath = ref();

    /* Composables */
    const { isModalOpen, openModal } = useModal();

    /* Lifecycle hooks */
    mainImagePath.value = process.env.VUE_APP_STORED_IMAGES_URL + place.value.images?.find((image) => image.is_main === 1)?.path ?? place.value.images[0]?.path;
    isSubButtonDisabled.value = Capacitor.getPlatform() === 'web' || !store.getters['auth/loggedIn'];
    /* Checking if users is subscribed to this place */
    if(store.getters['auth/loggedIn']) {
      CafeService.isUserSubscribed(place.value.id)
                 .then((response) => {
                   isUserSubscribed.value = !!response.data.subscribed;
                 })
                 .catch(() => {
                   isUserSubscribed.value = false;
                 });
    }

    onUnmounted(() => {
      if(route.query.openModal) {
        router.replace();
      }
    });

    /* Event handlers */
    const openPreview = async(place) => {
      const modal = await modalController
          .create({
            component: ImagePreviewModal,
            cssClass: 'custom-image-preview-modal',
            componentProps: {
              place,
            },
          });
      return modal.present();
    };

    return {
      /* Component properties */
      slideOpts,
      isSubButtonDisabled,
      isModalOpen,
      isUserSubscribed,
      mainImagePath,

      /* Computed properties */

      /* Event handlers */
      openModal,
      openPreview,

      /* Icons from */
      notifications,
      notificationsOutline,
    };
  },
});
</script>
<style scoped>
img.slider-images {
  max-height: 75px !important;
}
</style>