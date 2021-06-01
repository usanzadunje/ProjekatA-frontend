<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="flex justify-between">
          <ion-buttons slot="start">
            <ion-button href="/home">
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

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="relative">
        <img
            src="../../assets/img/cafe/cafeshow.png"
            alt="Image of {{ cafe.name }} cafe"
            class="banner-image w-full"
        />
        <div
            class="uppercase absolute bottom-2 right-3 bg-black opacity-60 popover-text-block inline-block text-white p-1.5"
        >
          GALERIJA
        </div>
      </div>

      <div class="mt-4 ion-item-no-padding-x">
        <h1 class="cafe-show-name">{{ cafe.name }}</h1>
        <p class="cafe-show-offers mt-1">Kafić, hrana, bašta. Nastavi dalje kako bi video šta vam naša aplikacija
                                         nudi.</p>
      </div>

      <CafeInfoBody :cafe="cafe"/>

      <div>
        <FilterCategoryHeading class="mt-7 mb-2 text-gray-400" :title="'Meni'" :icon="fastFoodOutline"/>
        <AccordionList
            class="accordion-list-border-top"
            :title="'Karta pica'"
            :items="cafe.offerings?.filter(offer => offer.tag === 'pice')"
        />
        <AccordionList
            class="accordion-list-border-top accordion-list-border-bottom"
            :title="'Hrana'"
            :items="cafe.offerings?.filter(offer => offer.tag === 'hrana')"
        />
      </div>

      <div class="mt-10">
        <ion-button
            class="uppercase button-subscribe-wide"
            expand="block"
            @click="openModal(true)"
            :disabled="!loggedIn"
        >
          <ion-icon slot="start"
                    :icon="isUserSubscribed ? notifications : notificationsOutline"></ion-icon>
          {{ isUserSubscribed ? 'Pretplacen' : 'Pretplati se' }}
        </ion-button>
      </div>
      <ion-modal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @onDidDismiss="openModal(false)"
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
import { defineComponent, ref, computed } from 'vue';

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
  IonModal,
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
  setup() {
    /* Global properties */
    const route = useRoute();
    const store = useStore();

    /* Componenet properties */
    let cafe = ref({});
    const isModalOpen = ref(false);
    const isUserSubscribed = ref(false);

    // Auth prop
    let loggedIn = computed(() => store.getters['auth/loggedIn']);


    /* Event handlers */
    const openModal = (state) => {
      isModalOpen.value = state;
    };

    /* Lifecycle hooks */
    /* Fetching all cafes from backend */
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


    return {
      /* Component properties */
      cafe,
      isModalOpen,
      isUserSubscribed,

      //Auth prop
      loggedIn,

      /* Event handlers */
      openModal,

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
  --background: #FFF;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

ion-content {
  --background: #FFF;
}

ion-item {
  --border-style: none !important;
}
</style>