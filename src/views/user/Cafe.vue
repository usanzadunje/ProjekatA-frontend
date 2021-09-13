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

          <div class="mb-2">
            <FilterCategoryHeading class="mt-7 mb-2" :title="$t('menu')" :icon="fastFoodOutline"/>
            <AccordionList
                class="accordion-list-border-top"
                :title="$t('drinksCard')"
                :items="cafe.offerings?.filter(offer => offer.tag === 'drink')"
                :icon="beerOutline"
            />
            <AccordionList
                class="accordion-list-border-top accordion-list-border-bottom"
                :title="$t('food')"
                :items="cafe.offerings?.filter(offer => offer.tag === 'food')"
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
            :cafe="{'id': cafe.id, 'name': cafe.name}"
            @dismissSubscriptionModal="openModal(false);"
            @userToggledSubscription="isUserSubscribed = !isUserSubscribed"
        />
      </Modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useStore }                                         from 'vuex';
import { useRoute }                                         from 'vue-router';
import { useI18n }                                          from 'vue-i18n';
import { Capacitor }                                        from '@capacitor/core';
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
}                                                           from '@ionic/vue';

import CafeInfoBody          from '@/components/user/CafeInfoBody';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import AccordionList         from '@/components/user/AccordionList';
import Modal                 from '@/components/Modal';
import CafeSubscriptionModal from '@/components/user/CafeSubscriptionModal';
import ImagePreviewModal     from '@/components/user/ImagePreviewModal';

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
    const cafe = ref({});
    const isUserSubscribed = ref(false);
    let searchTab = null;
    const platformIsWeb = Capacitor.getPlatform() === 'web';

    /* Computed properties */
    let loggedIn = computed(() => store.getters['auth/loggedIn']);

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { isModalOpen, openModal } = useModal();

    /* Lifecycle hooks */
    /* Fetching cafe from backend */
    onMounted(() => {
      getCafe();
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

    /* Methods */
    const getCafe = async() => {
      try {
        const response = await CafeService.show(route.params.id);
        cafe.value = response.data;
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


    /* Event handlers */
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


    /* Watchers */
    // Watching for changes of id parameter in cafe show route and fetching right data
    watch(route, async() => {
      if(route.name === 'cafe' && route.params.id) {
        getCafe();
      }
    });

    return {
      /* Global properties */

      /* Component properties */
      cafe,
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