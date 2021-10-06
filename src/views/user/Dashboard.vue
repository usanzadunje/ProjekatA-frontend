<template>
  <ion-page>

    <ion-content>
      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <UserProfileHeader/>


      <SlidingFilter @sort-has-changed="sortHasChanged" class="mt-2"/>

      <div class="px-4 pb-4 mt-3">
        <FilterCategoryHeading :title="$t('subscribedPlaces')" class="mb-2"/>

        <div v-show="!showSkeleton">
          <ion-item-sliding v-for="cafe in cafesUserSubscribedTo" :key="cafe.id" class="ion-no-padding mb-5">
            <ion-item class="ion-no-padding ion-no-margin relative">
              <Timer
                  id="timer"
                  :start="cafe.subscription_expires_in"
                  :key="cafe.subscription_expires_in"
                  class="absolute top-2 right-4 text-sm font-bold"
                  @subscription-expired="subscriptionExpired(cafe.id)"
              />
              <CafeCard
                  class="w-full"
                  :place="cafe"
                  @click="openModal(true, cafe, 'place')"
              />
            </ion-item>

            <ion-item-options side="end" @ionSwipe="unsubscribeSwiping(cafe.id)">
              <ion-item-option type="button" :expandable="true" @click="showAlert(cafe.id)">
                <ion-icon
                    slot="icon-only"
                    :icon="trashOutline"
                    class="text-2xl"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </div>

        <div v-show="showSkeleton">
          <div v-for="i in 5" :key="i" class="mb-5">
            <SkeletonCafeCard></SkeletonCafeCard>
          </div>
        </div>
      </div>

      <Modal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @didDismiss="openModal(false);"
      >
        <ShortCafeModal
            :place="modalData"
            @dismiss-short-cafe-modal="openModal(false)"
            @sub-modal-opened="hideModal('custom-modal')"
            @user-toggled-subscription="getSubscriptions"
        />
      </Modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRoute }             from 'vue-router';
import { useStore }             from 'vuex';
import { useI18n }              from 'vue-i18n';
import {
  IonContent,
  IonPage,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  alertController,
  IonRefresher,
  IonRefresherContent,
  onIonViewDidEnter,
}                               from '@ionic/vue';

import UserProfileHeader     from '@/components/user/headers/UserProfileHeader';
import SlidingFilter         from '@/components/user/SlidingFilter';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import Timer                 from '@/components/Timer';
import CafeCard              from '@/components/place/CafeCard';
import SkeletonCafeCard      from '@/components/place/SkeletonCafeCard';
import Modal                 from '@/components/Modal';
import ShortCafeModal        from '@/components/user/modals/ShortCafeModal';

import CafeService from '@/services/CafeService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useGeolocation }        from '@/composables/useGeolocation';
import { useModal }              from '@/composables/useModal';

import { Haptics, ImpactStyle } from '@capacitor/haptics';

import {
  trashOutline,
} from 'ionicons/icons';


export default defineComponent({
  name: 'Dashboard',
  components: {
    IonContent,
    IonPage,
    IonItemSliding,
    IonItem,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    UserProfileHeader,
    SlidingFilter,
    FilterCategoryHeading,
    Timer,
    CafeCard,
    Modal,
    ShortCafeModal,
    SkeletonCafeCard,
  },
  setup() {
    /* Global properties */
    const store = useStore();
    const { t } = useI18n();
    const route = useRoute();

    /* Component properties */
    // Cafes users is subscribed to
    const cafesUserSubscribedTo = ref([]);
    const sortBy = ref('distance');
    const showSkeleton = ref(true);

    /* Composables */
    const { showUndoToast, showSuccessToast, showErrorToast } = useToastNotifications();
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const { isModalOpen, modalData, openModal, hideModal } = useModal();

    /* Lifecycle hooks */
    onIonViewDidEnter(async() => {
      openModal(!!route.query.openModal);
      // Everytime users comes to the page give him view of fresh cafes he has subscribed to
      await getSubscriptions();
      showSkeleton.value = false;
    });

    /* Methods */
    const getSubscriptions = async() => {
      try {
        const response = await CafeService.getAllCafesUserSubscribedTo(
            sortBy.value,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        );
        cafesUserSubscribedTo.value = response.data;
      }catch(error) {
        showErrorToast(
            null,
            {
              pushNotificationPermission: t('dataFetchingError'),
            });
      }
    };
    const refresh = async(event) => {
      if(sortBy.value === 'distance') {
        await checkForLocationPermission();
      }
      await tryGettingLocation();

      await getSubscriptions();
      event.target.complete();
    };

    /* Event handlers */
    const sortHasChanged = async(sortValue) => {
      sortBy.value = sortValue;
      if(sortBy.value === 'distance') {
        await checkForLocationPermission();
      }
      await tryGettingLocation();
      await getSubscriptions();
    };
    const showAlert = async(cafeId) => {
      const alert = await alertController
          .create({
            header: t('alertUnsubscribeHeader'),
            message: t('alertUnsubscribeMessage'),
            mode: 'ios',
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: () => {
                  unsubscribe(cafeId);
                  showSuccessToast(t('successUnsubscribe'));
                },
              },
            ],
          });
      await alert.present();
    };

    const unsubscribe = async(cafeId) => {
      try {
        await CafeService.unsubscribe(cafeId);
        cafesUserSubscribedTo.value = cafesUserSubscribedTo.value.filter((cafe) => {
          return cafe.id !== cafeId;
        });
      }catch(error) {
        showErrorToast(
            null,
            {
              pushNotificationPermission: t('generalAlertError'),
            });
      }
    };
    const unsubscribeSwiping = (cafeId) => {
      unsubscribe(cafeId);
      Haptics.impact({ style: ImpactStyle.Heavy });
      showUndoToast(t('successUnsubscribe'), async() => {
        try {
          await CafeService.subscribe(cafeId);
        }catch(e) {
          showErrorToast(
              null,
              {
                generalError: t('generalAlertError'),
              });
        }finally {
          await getSubscriptions();
        }
      });
    };
    const subscriptionExpired = (placeId) => {
      cafesUserSubscribedTo.value = cafesUserSubscribedTo.value.filter(place => place.id !== placeId);
    };

    return {
      /* Component properties */
      cafesUserSubscribedTo,
      sortBy,
      isModalOpen,
      modalData,
      showSkeleton,

      /* Event handlers */
      sortHasChanged,
      showAlert,
      openModal,
      getSubscriptions,
      hideModal,
      refresh,
      unsubscribeSwiping,
      subscriptionExpired,

      /* Icons */
      trashOutline,
    };

  },

});
</script>
<style scoped>
ion-item {
  --border-style: none;
  --border-radius: 15px;
  border-top-right-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
  --inner-padding-end: 0;
}

ion-item-options {
  --border-style: none;
  background-color: #E01B43 !important;
  border-top-right-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}

ion-item-option {
  --border-style: none;
  --background: #e01b43;
  border-top-right-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}

ion-item-option:active {
  --background: #E01B43;
}

#timer {
  color: var(--primary-heading);
}
</style>