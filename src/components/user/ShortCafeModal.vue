<template>
  <ion-content class="ion-padding">
    <div class="relative w-full">
      <div class="absolute w-full">
        <ion-item class="ion-item-no-padding-x">
          <ion-thumbnail slot="start">
            <img
                :src="`${backendStorageURL}/cafe/test.png`"
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
          <ion-slides ref="slider" :options="slideOpts">
            <ion-slide v-for="i in [1,2,3]" :key="i">
              <img
                  :src="`${backendStorageURL}/cafe/test${i}.png`"
                  alt=""
              >
            </ion-slide>
          </ion-slides>
        </ion-item>
        <div class="mt-5 mb-3 flex justify-around">
          <ion-button
              class="mr-2.5 uppercase button-see-more modal-button-border"
              :href="`/cafes/${cafe.id}`"
              @click="$emit('dismissShortCafeModal')"
          > Pogledaj vise
          </ion-button>
          <ion-button
              class="uppercase button-subscribe modal-button-border"
              @click="openModal(true);$emit('subModalOpened');"
              :disabled="!loggedIn"
          >
            <ion-icon slot="start"
                      :icon="isUserSubscribed ? notifications : notificationsOutline"></ion-icon>
            {{ isUserSubscribed ? 'Pretplacen' : 'Pretplati se' }}
          </ion-button>
        </div>
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
          @dismissSubscriptionModal="openModal(false);$emit('dismissShortCafeModal')"
          @userToggledSubscription="isUserSubscribed = !isUserSubscribed"
      />
    </ion-modal>
  </ion-content>
</template>

<script>
import { defineComponent, ref, toRef, computed } from 'vue';

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
} from '@ionic/vue';

import CafeService from '@/services/CafeService';

import CafeInfoBody          from '@/components/user/CafeInfoBody';
import CafeSubscriptionModal from '@/components/user/CafeSubscriptionModal';

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
  emits: ['dismissShortCafeModal', 'subModalOpened'],
  updated() {
    const slides = document.querySelector("ion-slides");
    this.$nextTick(() => {
      slides.options = this.slideOpts;
    });
  },
  setup(props) {
    /* Global properties and methods */
    const store = useStore();

    /* Component properties */
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
      slidesPerView: 2.2,
    };
    const isModalOpen = ref(false);
    const isUserSubscribed = ref(false);
    const cafe = toRef(props, 'cafe');

    //Auth prop
    let loggedIn = computed(() => store.getters['auth/loggedIn']);

    /* Lifecycle hooks */
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

    return {
      /* Component properties */
      slideOpts,

      /* Component properties */
      isModalOpen,
      isUserSubscribed,

      /* Auth prop*/
      loggedIn,

      /* Event handlers */
      openModal,

      /* Icons from */
      notifications,
      notificationsOutline,
    };
  },
});
</script>
<style scoped>

</style>