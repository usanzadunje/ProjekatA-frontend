<template>
  <div class="px-4 pt-4">
    <div class="ion-item-no-padding-x flex items-center">
      <img
          :src="`${backendStorageURL}/cafe/1_2cafe.png`"
          alt="Logo of {{ cafe.name }}"
          class="modal-thumbnail radius-11px"
      >
      <div class="ml-4">
        <h1 class="modal-cafe-name-text">{{ cafe.name }}</h1>
        <p class="modal-cafe-offers">Kafic, hrana, basta...</p>
      </div>
    </div>

    <CafeInfoBody :cafe="cafe"/>
    <div class="mt-6 ion-no-padding">
      <ion-slides v-update-swiper :options="slideOpts">
        <ion-slide v-for="i in [1,2,3]" :key="i">
          <img
              :src="`${backendStorageURL}/cafe/2_${i}cafe.png`"
              alt=""
              @click="openPreview(`${backendStorageURL}/cafe/2_${i}cafe.png`)"
          >
        </ion-slide>
      </ion-slides>
    </div>

    <div class="mt-5 mb-3 flex justify-around">
      <ion-button
          class="flex-shrink mr-2.5 uppercase button-see-more modal-button-border"
          :routerLink="`/cafes/${cafe.id}?redirect=${$route.path + '?openModal=true'}`"
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
        :cafe="{'id': cafe.id, 'name': cafe.name}"
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
    cafe: {
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
    const cafe = toRef(props, 'cafe');
    const isSubButtonDisabled = ref(true);

    /* Composables */
    const { isModalOpen, openModal } = useModal();

    /* Lifecycle hooks */
    isSubButtonDisabled.value = Capacitor.getPlatform() === 'web' || !store.getters['auth/loggedIn'];
    /* Checking if users is subscribed to this cafe */
    if(store.getters['auth/loggedIn']) {
      CafeService.isUserSubscribed(cafe.value.id)
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
    const openPreview = async(id) => {
      const modal = await modalController
          .create({
            component: ImagePreviewModal,
            cssClass: 'custom-image-preview-modal',
            componentProps: {
              id,
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

</style>