<template>
  <ion-content>
    <div id="shortCafeModal" class="absolute bottom-0 w-full ion-padding">
      <ion-item class="ion-item-no-padding-x">
        <ion-thumbnail slot="start">
          <img
              :src="`${backendStorageURL}/cafe/1_2cafe.png`"
              alt="Logo of {{ cafe.name }}"
              class="modal-thumbnail"
          >
        </ion-thumbnail>
        <div>
          <h1 class="modal-cafe-name-text">{{ cafe.name }}</h1>
          <p class="modal-cafe-offers">Kafic, hrana, basta...</p>
        </div>
      </ion-item>

      <CafeInfoBody :cafe="cafe"/>
      <ion-item class="mt-6 ion-no-padding">
        <ion-slides id="gallerySlider" :options="slideOpts">
          <ion-slide v-for="i in [1,2,3]" :key="i">
            <img
                :src="`${backendStorageURL}/cafe/2_${i}cafe.png`"
                alt=""
                @click="openPreview(`${backendStorageURL}/cafe/2_${i}cafe.png`)"
            >
          </ion-slide>
        </ion-slides>
      </ion-item>

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
            :disabled="isSubDisabled"
        >
          <ion-icon slot="start"
                    :icon="isUserSubscribed ? notifications : notificationsOutline"></ion-icon>
          {{ isUserSubscribed ? $t('subscribed') : $t('subscribe') }}
        </ion-button>
      </div>
    </div>
    <ion-modal
        :is-open="isModalOpen"
        css-class="custom-sub-modal"
        @didDismiss="openModal(false);$emit('dismissShortCafeModal')"
        :backdrop-dismiss="true"
        :swipe-to-close="true"
    >
      <CafeSubscriptionModal
          :cafe="{'id': cafe.id, 'name': cafe.name}"
          :isUserSubscribed="isUserSubscribed"
          @dismissSubscriptionModal="openModal(false);"
          @userToggledSubscription="isUserSubscribed = !isUserSubscribed"
          @userUnsubscribed="$emit('userUnsubscribed')"
      />
    </ion-modal>
  </ion-content>
</template>

<script>
import { defineComponent, ref, toRef, computed, onMounted, onUnmounted } from 'vue';
import { Capacitor }                                                     from '@capacitor/core';


import { useRoute, useRouter } from 'vue-router';

import { useStore } from 'vuex';

import {
  IonContent,
  IonThumbnail,
  IonItem,
  IonIcon,
  IonButton,
  IonSlides,
  IonSlide,
  IonModal,
  modalController,
} from '@ionic/vue';

import CafeService from '@/services/CafeService';

import CafeInfoBody          from '@/components/user/CafeInfoBody';
import CafeSubscriptionModal from '@/components/user/CafeSubscriptionModal';
import ImagePreviewModal     from '@/components/user/ImagePreviewModal';

import {
  notifications,
  notificationsOutline,

} from 'ionicons/icons';


export default defineComponent({
  name: 'ShortCafeModal',
  components: {
    IonContent,
    IonThumbnail,
    IonItem,
    IonIcon,
    IonButton,
    IonSlides,
    IonSlide,
    IonModal,
    CafeSubscriptionModal,
    CafeInfoBody,
  },
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismissShortCafeModal', 'subModalOpened', 'userUnsubscribed'],
  setup(props) {
    /* Global properties and methods */
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    /* Component properties */
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
      slidesPerView: 2.2,
    };
    const isModalOpen = ref(false);
    const isUserSubscribed = ref(false);
    const cafe = toRef(props, 'cafe');
    const isSubDisabled = ref(true);

    //Auth prop
    const loggedIn = computed(() => store.getters['auth/loggedIn']);

    /* Lifecycle hooks */
    isSubDisabled.value = Capacitor.getPlatform() === 'web' || !loggedIn.value;

    onMounted(() => {
      const slides = document.getElementById("gallerySlider");
      setTimeout(() => {
        slides.options = slideOpts;
        slides.update();

        const height = document.querySelector('#shortCafeModal').getClientRects()[0].height;
        document.querySelector('.custom-modal .modal-wrapper').style.height = height + 'px';
      }, 300);
    });

    onUnmounted(() => {
      if(route.query.openModal) {
        router.replace();
      }
    });
    /* Checking if user is subscribed to this cafe */
    if(loggedIn.value) {
      CafeService.isUserSubscribed(cafe.value.id)
                 .then((response) => {
                   isUserSubscribed.value = !!response.data;
                 })
                 .catch((error) => alert(error));
    }

    /* Event handlers */
    const openModal = (state) => {
      isModalOpen.value = state;
    };
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
      isSubDisabled,

      /* Component properties */
      isModalOpen,
      isUserSubscribed,

      /* Auth prop*/
      loggedIn,

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