<template>
  <ion-content class="ion-padding">
    <ion-item class="mt-3 ion-item-no-padding-x">
      <ion-thumbnail slot="start">
        <img
            src="../../assets/img/cafe/test.png"
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

    <ion-item class="mt-5 ion-no-padding">
      <ion-slides :options="slideOpts">
        <ion-slide v-for="i in [1,2,3,4,5]" :key="i">
          <img src="../../assets/img/cafe/test1.png" alt="">
        </ion-slide>
      </ion-slides>
    </ion-item>
    <div class="mt-5 mb-3 flex justify-between">
      <ion-button
          class="uppercase button-see-more modal-button-border"
          :href="`/cafes/${cafe.id}`"
          @click="$emit('dismissShortCafeModal')"
      > Pogledaj vise
      </ion-button>
      <ion-button
          class="uppercase button-subscribe modal-button-border"
          @click="openModal(true)"
          :disabled="!loggedIn"
      >
        <ion-icon slot="start"
                  :icon="isUserSubscribed ? notificationsReceivedFilled : notificationsOutlineWhite"></ion-icon>
        {{ isUserSubscribed ? 'Pretplacen' : 'Pretplati se' }}
      </ion-button>
    </div>
    <ion-modal
        :is-open="isModalOpen"
        css-class="custom-modal"
        @onDidDismiss="openModal(false);$emit('dismissShortCafeModal')"
        :backdrop-dismiss="true"
        :swipe-to-close="true"
    >
      <CafeSubscriptionModal
          :cafe="{'id': cafe.id, 'name': cafe.name}"
          @dismissSubscriptionModal="openModal(false);$emit('dismissShortCafeModal')"
          @userToggledSubscription="isUserSubscribed = !isUserSubscribed"
      />
    </ion-modal>
  </ion-content>
</template>

<script>
import { defineComponent, onMounted, nextTick, ref, toRef, computed } from 'vue';

import { useStore } from 'vuex'

import {
  IonContent,
  IonThumbnail,
  IonItem,
  IonIcon,
  IonButton,
  IonSlides,
  IonSlide,
  IonModal,
}                                                            from '@ionic/vue';
import CafeInfoBody                                          from '@/components/user/CafeInfoBody';
import {
  graphSliceYellowFilled,
  locationInactiveOutline,
  notificationsOutlineWhite,
  notificationsReceivedFilled,
  fastFoodOutline,
  leafOutline,
  timeOutline,
}                                                            from '@/assets/icons';
import CafeSubscriptionModal                                 from '@/components/user/CafeSubscriptionModal';
import CafeService                                           from '@/services/CafeService';

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
  emits: ['dismissShortCafeModal'],
  setup(props) {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
      centeredSlides: false,
      slidesPerView: 2.2,
      spaceBetween: 12,
      freeMode: true,
    };

    /* Properties */
    const isModalOpen = ref(false);
    const isUserSubscribed = ref(false);
    const cafe = toRef(props, 'cafe');

    let loggedIn = computed(() => store.getters['auth/loggedIn']);

    /* Lifecycle hooks */
    /* Checking if user is subscribed to this cafe */
    if(loggedIn.value){
      CafeService.isUserSubscribed(cafe.value.id)
                 .then((response) => {
                   isUserSubscribed.value = !!response.data;
                 })
                 .catch((error) => alert(error));
    }
    // Without this on android options are not passed to swiper
    onMounted(() => {
      const slides = document.querySelector("ion-slides");
      nextTick(() => {
        slides.options = slideOpts;
      });
    });

    /* Event handlers */
    const openModal = (state) => {
      isModalOpen.value = state;
    };

    return {
      /* Component properties */
      slideOpts,

      /* Properties */
      isModalOpen,
      isUserSubscribed,
      loggedIn,

      /* Event handlers */
      openModal,

      /* Icons */
      graphSliceYellowFilled,
      locationInactiveOutline,
      notificationsOutlineWhite,
      notificationsReceivedFilled,
      fastFoodOutline,
      leafOutline,
      timeOutline,
    };
  },
});
</script>