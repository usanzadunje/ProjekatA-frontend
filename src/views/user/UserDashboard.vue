<template>
  <ion-page>

    <ion-content>
      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <TheUserProfileHeader/>

      <SlidingFilter v-if="!showSkeleton" @sort-has-changed="sortHasChanged" class="mt-2 px-4"/>

      <div class="px-4 pb-4 mt-3">
        <FilterCategoryHeading :title="$t('subscribedPlaces')" class="mb-2"/>

        <div v-show="!showSkeleton">
          <ion-item-sliding
              ref="slidingItem"
              v-for="place in placesUserSubscribedTo"
              :key="place.id"
              class="ion-no-padding mb-5"
              @click="closeOpenItems"
          >
            <ion-item class="ion-no-padding ion-no-margin relative">
              <Timer
                  :timer-text-id="`expiryText${place.id}`"
                  :start="place.subscription_expires_in"
                  :key="place.subscription_expires_in"
                  class="absolute top-1 right-3 text-sm font-bold primary-text-color"
                  @subscription-expired="removeExpiredSubscription(place.id)"
              />
              <PlaceCard
                  class="w-full"
                  :place="place"
                  @click="openModal(true, place)"
              />
            </ion-item>

            <ion-item-options side="end" @ionSwipe="unsubscribeSwiping(place.id)">
              <ion-item-option type="button" :expandable="true" @click="showAlert(place.id)">
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
            <PlaceCardSkeleton></PlaceCardSkeleton>
          </div>
        </div>
      </div>

      <AppModal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @didDismiss="openModal(false);"
      >
        <PlaceInfoModal
            :place="modalData"
            @dismiss-place-info-modal="openModal(false)"
            @sub-modal-opened="hideModal('custom-modal')"
            @user-toggled-subscription="getSubscriptions"
        />
      </AppModal>
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

import TheUserProfileHeader from '@/components/user/headers/TheUserProfileHeader';
import SlidingFilter     from '@/components/user/SlidingFilter';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import Timer                 from '@/components/Timer';
import PlaceCard             from '@/components/place/PlaceCard';
import PlaceCardSkeleton     from '@/components/place/PlaceCardSkeleton';
import AppModal                 from '@/components/AppModal';
import PlaceInfoModal        from '@/components/user/modals/PlaceInfoModal';

import PlaceService from '@/services/PlaceService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useGeolocation }        from '@/composables/useGeolocation';
import { useModal }              from '@/composables/useModal';
import { useSlidingItem }        from '@/composables/useSlidingItem';

import { Haptics, ImpactStyle } from '@capacitor/haptics';

import {
  trashOutline,
} from 'ionicons/icons';


export default defineComponent({
  name: 'UserDashboard',
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
    TheUserProfileHeader,
    SlidingFilter,
    FilterCategoryHeading,
    Timer,
    PlaceCard,
    AppModal,
    PlaceInfoModal,
    PlaceCardSkeleton,
  },
  setup() {
    /* Global properties */
    const store = useStore();
    const { t } = useI18n();
    const route = useRoute();

    /* Component properties */
    // places users is subscribed to
    const placesUserSubscribedTo = ref([]);
    const sortBy = ref('distance');
    const showSkeleton = ref(true);
    let timeLeftText = null;

    /* Composables */
    const { showUndoToast, showSuccessToast, showErrorToast } = useToastNotifications();
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const { isModalOpen, modalData, openModal, hideModal } = useModal();
    const { slidingItem, closeOpenItems } = useSlidingItem();

    /* Lifecycle hooks */
    onIonViewDidEnter(async() => {
      openModal(!!route.query.openModal);
      // Everytime users comes to the page give him view of fresh places he has subscribed to
      await getSubscriptions();
      showSkeleton.value = false;
    });

    /* Methods */
    const getSubscriptions = async() => {
      try {
        const response = await PlaceService.userSubscriptions(
            sortBy.value,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        );
        placesUserSubscribedTo.value = response.data;
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
    const showAlert = async(placeId) => {
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
                  unsubscribe(placeId);
                  showSuccessToast(t('successUnsubscribe'));
                },
              },
            ],
          });
      await alert.present();
    };

    const unsubscribe = async(placeId) => {
      try {
        await PlaceService.unsubscribe(placeId);
        placesUserSubscribedTo.value = placesUserSubscribedTo.value.filter((place) => {
          return place.id !== placeId;
        });
      }catch(error) {
        showErrorToast(
            null,
            {
              pushNotificationPermission: t('generalAlertError'),
            });
      }
    };
    const unsubscribeSwiping = (placeId) => {
      timeLeftText = document.getElementById('expiryText' + placeId)?.innerHTML.split(' ');

      unsubscribe(placeId);
      Haptics.impact({ style: ImpactStyle.Heavy });
      showUndoToast(t('successUnsubscribe'), async() => {
        try {
          const notifyIn = timeLeftText?.length > 0 ? timeLeftText[0] : null;

          await PlaceService.subscribe(placeId, notifyIn);
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
    const removeExpiredSubscription = (placeId) => {
      placesUserSubscribedTo.value = placesUserSubscribedTo.value.filter(place => place.id !== placeId);
    };

    return {
      /* Component properties */
      placesUserSubscribedTo,
      sortBy,
      isModalOpen,
      modalData,
      showSkeleton,
      slidingItem,

      /* Event handlers */
      sortHasChanged,
      showAlert,
      openModal,
      getSubscriptions,
      hideModal,
      refresh,
      unsubscribeSwiping,
      removeExpiredSubscription,
      closeOpenItems,

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
</style>