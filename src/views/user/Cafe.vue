<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="flex justify-between mt-3 md margin-top-reset">
          <ion-buttons slot="start">
            <ion-button
                :routerLink="`${$route.query.redirect ?? '/home'}`">
              <ion-icon slot="icon-only" :icon="arrowBackOutline" class="text-gray-400"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-buttons slot="start">
            <ion-button>
              <ion-icon slot="icon-only" :icon="notificationsOutline" class="text-gray-400"></ion-icon>
            </ion-button>
          </ion-buttons>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding relative">
      <div class="relative">
        <img
            :src="`${backendStorageURL}/cafe/1_1cafe.png`"
            :alt="`Image of ${cafe.name} cafe`"
            @click="openPreview('1', 2)"
            class="banner-image w-full"
        />
        <div
            class="uppercase absolute bottom-2 right-3 bg-black opacity-60 popover-text-block inline-block text-white p-1.5"
        >
          {{ $t('gallery') }}
        </div>
      </div>

      <div class="mt-4 ion-item-no-padding-x">
        <h1 class="cafe-show-name">{{ cafe.name }}</h1>
        <p class="cafe-show-offers mt-1">{{ $t('showPlace') }}</p>
      </div>

      <CafeInfoBody :cafe="cafe"/>

      <div>
        <FilterCategoryHeading class="mt-7 mb-2" :title="$t('menu')" :icon="fastFoodOutline"/>
        <AccordionList
            class="accordion-list-border-top"
            :title="$t('drinksCard')"
            :items="cafe.offerings?.filter(offer => offer.tag === 'pice')"
        />
        <AccordionList
            class="accordion-list-border-top accordion-list-border-bottom"
            :title="$t('food')"
            :items="cafe.offerings?.filter(offer => offer.tag === 'food')"
        />
      </div>

      <div class="mt-10">
        <ion-button
            class="uppercase button-subscribe-wide button-sub-wide-position"
            expand="block"
            @click="openModal(true)"
            :disabled="!loggedIn"
        >
          <ion-icon slot="start"
                    :icon="isUserSubscribed ? notifications : notificationsOutline"></ion-icon>
          {{ isUserSubscribed ? $t('subscribed') : $t('subscribe') }}
        </ion-button>
      </div>
      <ion-modal
          :is-open="isModalOpen"
          css-class="custom-sub-modal"
          @didDismiss="openModal(false)"
          :backdrop-dismiss="true"
          :swipe-to-close="true"
      >
        <CafeSubscriptionModal
            :cafe="{'id': cafe.id, 'name': cafe.name}"
            @dismissSubscriptionModal="openModal(false)"
            @userToggledSubscription="isUserSubscribed = !isUserSubscribed"
        />
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';

import { useStore } from 'vuex';

import { useRoute } from 'vue-router';


import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonIcon,
  IonButton,
  IonModal, modalController,
} from '@ionic/vue';

import CafeInfoBody          from '@/components/user/CafeInfoBody';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import AccordionList         from '@/components/user/AccordionList';
import CafeSubscriptionModal from '@/components/user/CafeSubscriptionModal';

import CafeService from '@/services/CafeService';

import {
  arrowBackOutline,
  notifications,
  notificationsOutline,
  fastFoodOutline,
}
                         from 'ionicons/icons';
import ImagePreviewModal from '@/components/user/ImagePreviewModal';

export default defineComponent({
  name: "Cafe",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonContent,
    IonIcon,
    IonButton,
    IonModal,
    CafeInfoBody,
    FilterCategoryHeading,
    AccordionList,
    CafeSubscriptionModal,
  },
  ionViewWillEnter() {
    setTimeout(() => {
      document.getElementById('tab-button-search').style.color = '#207DFF';

      document.querySelector('ion-tabs').style.setProperty("background-color", "var(--show-paint)", "important");
    }, 200);
  },
  ionViewWillLeave() {
    document.getElementById('tab-button-search').style.color = '';

    document.querySelector('ion-tabs').style.setProperty("background-color", "var(--primary-paint)", "important");
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const store = useStore();

    /* Component properties */
    let cafe = ref({});
    const isModalOpen = ref(false);
    const isMapModalOpen = ref(false);
    const isUserSubscribed = ref(false);

    // Auth prop
    let loggedIn = computed(() => store.getters['auth/loggedIn']);


    /* Event handlers */
    const openModal = (state, isMapModal = false) => {
      if(isMapModal) {
        isMapModalOpen.value = state;
      }else {
        isModalOpen.value = state;
      }
    };
    const openPreview = async(id, imgCount) => {
      const modal = await modalController
          .create({
            component: ImagePreviewModal,
            cssClass: 'custom-gallery-modal',
            componentProps: {
              id,
              imgCount,
            },
          });
      return modal.present();
    };

    /* Lifecycle hooks */
    /* Fetching cafe from backend */
    CafeService.show(route.params.id)
               .then((response) => {
                 cafe.value = response.data;
               })
               .catch((error) => alert(error));
    /* Checking if user is subscribed to this cafe */
    if(loggedIn.value) {
      CafeService.isUserSubscribed(route.params.id)
                 .then((response) => {
                   isUserSubscribed.value = !!response.data;
                 })
                 .catch((error) => alert(error));
    }


    /* Watchers */
    // Watching for changes of id parameter in cafe show route and fetching right data
    watch(route, () => {
      if(route.name === 'cafe' && route.params.id) {
        CafeService.show(route.params.id)
                   .then((response) => {
                     cafe.value = response.data;
                   })
                   .catch((error) => alert(error));
      }
    });

    return {
      /* Global properties */

      /* Component properties */
      cafe,
      isModalOpen,
      isMapModalOpen,
      isUserSubscribed,

      //Auth prop
      loggedIn,

      /* Event handlers */
      openModal,
      openPreview,

      /* Icons */
      arrowBackOutline,
      notifications,
      notificationsOutline,
      fastFoodOutline,
    };
  },

});
</script>
<style scoped>

ion-toolbar {
  --border-style: none;
  --background: var(--show-paint);
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

ion-item {
  --border-style: none !important;
}

ion-content {
  --background: var(--show-paint);
}
</style>