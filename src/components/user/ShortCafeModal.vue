<template>
  <ion-content class="ion-padding">
    <ion-item class="mt-3">
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
    <ion-item>
      <ion-icon :icon="graphSliceYellowFilled" class="mr-2"></ion-icon>
      <span class="modal-cafe-text-medium mt-0.5">{{ cafe.taken_capacity }} - slobodnih mesta</span>
    </ion-item>
    <ion-item class="ion-item-no-padding-x">
      <div class="flex justify-between">
        <ion-icon :icon="locationInactiveOutline" class="mr-2"></ion-icon>
        <p class="modal-cafe-text-regular">{{ cafe.address }} - {{ cafe.city }}</p>
      </div>
      <ion-button fill="clear" class="uppercase" slot="end">MAPA</ion-button>
    </ion-item>
    <div class="flex justify-start mt-1.5">
      <div class="ion-item-no-padding-x flex">
        <ion-icon :icon="fastFoodOutline" class="mr-2"></ion-icon>
        <p class="modal-cafe-text-regular">hrana</p>
      </div>
      <div class="ion-item-no-padding-x flex ml-3.5">
        <ion-icon :icon="leafOutline" class="mr-2"></ion-icon>
        <p class="modal-cafe-text-regular">poseduje bastu</p>
      </div>
      <div class="ion-item-no-padding-x flex ml-3.5">
        <ion-icon :icon="timeOutline" class="mr-2"></ion-icon>
        <p class="modal-cafe-text-regular">09am-01pm</p>
      </div>
    </div>
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
          @click="$router.push({ name: 'cafes', params: { id: cafe.id } });$emit('dismissShortCafeModal')"
      > Pogledaj vise</ion-button>
      <ion-button
          class="uppercase button-subscribe modal-button-border"
          @click="openModal(true)"
      >
        <ion-icon slot="start"
                  :icon="isUserSubscribed ? notificationsReceivedOutline : notificationsOutlineWhite"></ion-icon>
        Pretplati se
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
          @userSubscribedToCafe="isUserSubscribed = !isUserSubscribed"
      />
    </ion-modal>
  </ion-content>
</template>

<script>
import { defineComponent, onMounted, nextTick, ref } from 'vue';
import {
  IonContent,
  IonThumbnail,
  IonItem,
  IonIcon,
  IonButton,
  IonSlides,
  IonSlide,
  IonModal,
}                                                    from '@ionic/vue';
import {
  graphSliceYellowFilled,
  locationInactiveOutline,
  notificationsOutlineWhite,
  notificationsReceivedOutline,
  fastFoodOutline,
  leafOutline,
  timeOutline,
}                                                    from '@/assets/icons';
import CafeSubscriptionModal                         from '@/components/user/CafeSubscriptionModal';

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
  },
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismissShortCafeModal'],
  setup() {
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

    /* Lifecycle hook */
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

      /* Event handlers */
      openModal,

      /* Icons */
      graphSliceYellowFilled,
      locationInactiveOutline,
      notificationsOutlineWhite,
      notificationsReceivedOutline,
      fastFoodOutline,
      leafOutline,
      timeOutline,
    };
  },
});
</script>