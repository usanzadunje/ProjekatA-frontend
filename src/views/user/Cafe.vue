<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="flex justify-between">
          <ion-buttons slot="start">
            <ion-button href="/home">
              <ion-icon slot="icon-only" :icon="arrowBackwardOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-buttons slot="start">
            <ion-button>
              <ion-icon slot="icon-only" :icon="notificationsOutline"></ion-icon>
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
            class="banner-image"
        />
        <div
            class="uppercase absolute top-3/4 left-3/4 bg-black opacity-60 popover-text-block inline-block text-white p-1.5"
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
        <FilterCategoryHeading class="mt-7 mb-2" :title="'Meni'" :icon="fastFoodOutline"/>
        <AccordionList class="accordion-list-border-top" :title="'Karta pica'" :items="['Pice 1','Pice 2', 'Pice 3']"/>
        <AccordionList class="accordion-list-border-top accordion-list-border-bottom" :title="'Hrana'"
                       :items="['Hrana 1','Hrana 2', 'Hrana 3']"/>
      </div>

      <div class="mt-10">
        <ion-button
            class="uppercase button-subscribe-wide"
            expand="block"
            @click="openModal(true)"
        >
          <ion-icon slot="start"
                    :icon="isUserSubscribed ? notificationsReceivedOutline : notificationsOutlineWhite"></ion-icon>
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
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonIcon,
  IonButton,
  IonModal,
}                            from '@ionic/vue';
import CafeInfoBody          from '@/components/user/CafeInfoBody';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import AccordionList         from '@/components/user/AccordionList';
import CafeSubscriptionModal from '@/components/user/CafeSubscriptionModal';
import CafeService           from '@/services/CafeService';
import { ref }               from 'vue';
import { useRoute }          from 'vue-router';
import {
  arrowBackwardOutline,
  notificationsOutline,
  graphSliceYellowFilled,
  locationInactiveOutline,
  notificationsOutlineWhite,
  notificationsReceivedOutline,
  fastFoodOutline,
  leafOutline,
  timeOutline,
}                            from '@/assets/icons';

export default {
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
    const route = useRoute();

    /* Properties */
    let cafe = ref({});
    const isModalOpen = ref(false);
    const isUserSubscribed = ref(false);


    /* Event handlers */
    const openModal = (state) => {
      isModalOpen.value = state;
    };

    /* Lifecycle hooks */
    /* Fetching all cafes from backend */
    CafeService.show(route.params.id)
               .then((response) => cafe.value = response.data)
               .catch((error) => alert(error));

    CafeService.isUserSubscribed(route.params.id)
               .then((response) => {
                 isUserSubscribed.value = !!response.data;
               })
               .catch((error) => alert(error));


    return {
      /* Properties */
      cafe,
      isModalOpen,
      isUserSubscribed,

      /* Event handlers */
      openModal,

      /* Icons */
      arrowBackwardOutline,
      notificationsOutline,
      graphSliceYellowFilled,
      locationInactiveOutline,
      notificationsOutlineWhite,
      notificationsReceivedOutline,
      fastFoodOutline,
      leafOutline,
      timeOutline,
    };
  },

};
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