<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="flex justify-between mt-3 md margin-top-reset">
          <ion-buttons slot="start">
            <ion-button
                :routerLink="`${$route.query.redirect || '/home'}`">
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
      <div id="flex" class="flex flex-col justify-between">
        <div>
          <div class="relative">
            <img
                ref="mainImage"
                src=""
                :alt="`Image of ${place.name} place`"
                @click="openPreview(place)"
                class="banner-image w-full object-fill"
            />
            <div
                class="uppercase absolute bottom-2 right-3 bg-black opacity-60 popover-text-block inline-block text-white p-1.5"
            >
              {{ $t('gallery') }}
            </div>
          </div>

          <div class="mt-4 ion-item-no-padding-x">
            <h1 class="cafe-show-name">{{ place.name }}</h1>
            <p class="cafe-show-offers mt-1">{{ $t('showPlace') }}</p>
          </div>

          <CafeInfoBody :place="place"/>

          <div class="mb-2">
            <FilterCategoryHeading class="mt-7 mb-2" :title="$t('menu')" :icon="fastFoodOutline"/>
            <AccordionList
                class="accordion-list-border-top"
                :title="$t('drinksCard')"
                :items="place.offerings?.filter(offer => offer.tag === 'drink')"
                :icon="beerOutline"
            />
            <AccordionList
                class="accordion-list-border-top accordion-list-border-bottom"
                :title="$t('food')"
                :items="place.offerings?.filter(offer => offer.tag === 'food')"
                :icon="pizzaOutline"
            />
          </div>
        </div>

        <div>
          <ion-button
              class="uppercase button-subscribe-wide"
              expand="block"
              @click="openModal(true)"
              :disabled="!loggedIn || platformIsWeb"
          >
            <ion-icon slot="start"
                      :icon="isUserSubscribed ? notifications : notificationsOutline"></ion-icon>
            {{ isUserSubscribed ? $t('subscribed') : $t('subscribe') }}
          </ion-button>
        </div>
      </div>
      <Modal
          :is-open="isModalOpen"
          css-class="custom-sub-modal"
          @didDismiss="openModal(false);$emit('dismissShortCafeModal')"
      >
        <CafeSubscriptionModal
            :place="{'id': place.id, 'name': place.name}"
            @dismiss-subscription-modal="openModal(false);"
            @user-toggled-subscription="isUserSubscribed = !isUserSubscribed"
        />
      </Modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore }                              from 'vuex';
import { useRoute }                              from 'vue-router';
import { useI18n }                               from 'vue-i18n';
import { Capacitor }                             from '@capacitor/core';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonIcon,
  IonButton,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
}                                                from '@ionic/vue';

import CafeInfoBody          from '@/components/place/CafeInfoBody';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import AccordionList         from '@/components/user/AccordionList';
import Modal                 from '@/components/Modal';
import CafeSubscriptionModal from '@/components/user/modals/CafeSubscriptionModal';
import ImagePreviewModal     from '@/components/user/modals/ImagePreviewModal';

import CafeService from '@/services/CafeService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useModal }              from '@/composables/useModal';
import {
  arrowBackOutline,
  notifications,
  notificationsOutline,
  fastFoodOutline,
  pizzaOutline,
  beerOutline,
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
    CafeInfoBody,
    FilterCategoryHeading,
    AccordionList,
    Modal,
    CafeSubscriptionModal,
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    const place = ref({});
    const isUserSubscribed = ref(false);
    const mainImage = ref();
    let searchTab = null;
    const platformIsWeb = Capacitor.getPlatform() === 'web';

    /* Computed properties */
    let loggedIn = computed(() => store.getters['auth/loggedIn']);

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { isModalOpen, openModal } = useModal();

    /* Methods */
    const getPlace = async() => {
      try {
        const response = await CafeService.show(route.params.id);
        place.value = response.data;
        if(loggedIn.value) {
          const subscriptionResponse = await CafeService.isUserSubscribed(route.params.id);
          isUserSubscribed.value = !!subscriptionResponse.data.subscribed;
        }
      }catch(error) {
        showErrorToast(
            null,
            {
              generalError: t('dataFetchingError'),
            });
      }
    };

    /* Lifecycle hooks */
    getPlace().then(() => {
      const mainImg = place.value.images?.find((image) => image.is_main === 1) ?? place.value.images[0];
      mainImage.value.src = process.env.VUE_APP_STORED_IMAGES_URL + mainImg?.path;
    });
    onIonViewWillEnter(() => {
      searchTab = document.getElementById('tab-button-search');
      if(searchTab) {
        searchTab.style.color = '#207DFF';
      }
    });
    onIonViewWillLeave(() => {
      if(searchTab) {
        searchTab.style.color = '';
      }
    });


    /* Event handlers */
    const openPreview = async(place) => {
      const modal = await modalController
          .create({
            component: ImagePreviewModal,
            cssClass: 'custom-gallery-modal',
            componentProps: {
              place,
            },
          });
      return modal.present();
    };


    /* Watchers */
    // Watching for changes of id parameter in place show route and fetching right data
    watch(route, async() => {
      if(route.name === 'cafe' && route.params.id) {
        await getPlace();
      }
    });

    return {
      /* Global properties */

      /* Component properties */
      place,
      mainImage,
      isModalOpen,
      isUserSubscribed,
      platformIsWeb,

      /* Computed properties */
      loggedIn,

      /* Event handlers */
      openModal,
      openPreview,

      /* Icons */
      arrowBackOutline,
      notifications,
      notificationsOutline,
      fastFoodOutline,
      pizzaOutline,
      beerOutline,
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

ion-content {
  --background: var(--show-paint);
}

@media screen and (min-height: 740px) {
  #flex {
    height: 100% !important;
  }
}
</style>