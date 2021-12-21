<template>
  <ion-page>
    <div>
      <TheUserProfileHeader/>
      <SlidingFilter
          v-if="!showSkeleton"
          v-show="userHasSubscriptions"
          class="mt-2 px-4"
          @sort-has-changed="sortHasChanged"
      />
    </div>

    <ion-content>
      <ion-refresher
          pull-min="100"
          slot="fixed"
          @ionRefresh="refresh($event)"
          class="transparent"
      >
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div
          v-show="userHasSubscriptions"
          class="px-4 pb-4 mt-3"
      >
        <FilterCategoryHeading
            :title="$t('subscribedPlaces')"
            :icon="bookmark"
            class="mb-2"
        />

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

            <ion-item-options side="end" @ionSwipe="unsubscribeSwiping(place, $event)">
              <ion-item-option type="button" :expandable="true" @click="showAlert(place, $event)">
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

      <div
          v-show="!userHasSubscriptions"
          class="w-full h-full flex flex-col items-center justify-center px-6"
      >
        <AddSubscriptionsPlaceholderImage/>

        <div class="flex flex-col items-center mt-2">
          <p class="text-center placeholder-heading-big primary-text-color">
            {{ $t('noSubscriptionsHeading1') }}
          </p>
          <p class="text-center placeholder-heading-small primary-text-color break-words">
            {{ $t('noSubscriptionsHeading2') }}
          </p>

          <ion-button
              class="user-selected-button-background mt-2"
              @click="this.$router.push({ name: 'search' })"
          >
            {{ $t('findPlace') }}
          </ion-button>
        </div>
      </div>

      <AppModal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @didDismiss="openModal(false);"
      >
        <PlaceInfoModal
            :place="modalData"
            @dismiss="openModal(false)"
            @user-toggled-subscription="getSubscriptions"
        />
      </AppModal>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute }                              from 'vue-router';
import { useStore }                              from 'vuex';
import { useI18n }                               from 'vue-i18n';
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
  IonButton,
  onIonViewDidEnter,
}                                                from '@ionic/vue';

import TheUserProfileHeader             from '@/components/user/headers/TheUserProfileHeader';
import SlidingFilter                    from '@/components/user/SlidingFilter';
import FilterCategoryHeading            from '@/components/user/FilterCategoryHeading';
import Timer                            from '@/components/Timer';
import PlaceCard                        from '@/components/place/PlaceCard';
import PlaceCardSkeleton                from '@/components/place/PlaceCardSkeleton';
import AppModal                         from '@/components/AppModal';
import PlaceInfoModal                   from '@/components/user/modals/PlaceInfoModal';
import AddSubscriptionsPlaceholderImage from '@/components/images/AddSubscriptionsPlaceholderImage';

import PlaceService from '@/services/PlaceService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useGeolocation }        from '@/composables/useGeolocation';
import { useModal }              from '@/composables/useModal';
import { useSlidingItem }        from '@/composables/useSlidingItem';
import { useErrorHandling }      from '@/composables/useErrorHandling';
import { shrink, swipe }         from '@/composables/useAnimations';

import { Haptics, ImpactStyle } from '@capacitor/haptics';

import {
  bookmark,
  trashOutline,
}                           from 'ionicons/icons';
import { useNotifications } from '@/composables/useNotificataions';

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
    IonButton,
    TheUserProfileHeader,
    SlidingFilter,
    FilterCategoryHeading,
    Timer,
    PlaceCard,
    AppModal,
    PlaceInfoModal,
    PlaceCardSkeleton,
    AddSubscriptionsPlaceholderImage,
  },
  setup() {
    /* Global properties */
    const store = useStore();
    const { t } = useI18n();
    const route = useRoute();

    /* Component properties */
    // places users is subscribed to
    const placesUserSubscribedTo = ref([]);
    const userHasSubscriptions = computed(() => store.getters['user/hasSubscriptions']);
    const sortBy = ref('distance');
    const showSkeleton = ref(true);
    let timeLeftText = null;

    /* Composables */
    const { showUndoToast, showSuccessToast } = useToastNotifications();
    const { position, checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const { isModalOpen, modalData, openModal } = useModal();
    const { slidingItem, closeOpenItems } = useSlidingItem();
    const { tryCatch } = useErrorHandling();
    const { fullSwipeLeft } = swipe();
    const { shrinkToMiddle } = shrink();
    const { newestNotificationPayload } = useNotifications();

    /* Lifecycle hooks */
    onIonViewDidEnter(async() => {
      //Safety check, do not open modal if there is no data to be shown inside it
      if(modalData.value) {
        openModal(!!route.query.openModal);
      }

      // Everytime users comes to the page give him view of fresh places he has subscribed to
      await getSubscriptions();

      showSkeleton.value = false;

      if(route.query.id && !isModalOpen.value) {
        openModal(true, placesUserSubscribedTo.value.find(place => place.id === Number(route.query.id)));
      }
    });

    /* Methods */
    const getSubscriptions = async() => {
      await tryCatch(
          async() => {
            const response = await PlaceService.userSubscriptions(
                sortBy.value,
                position.value.latitude,
                position.value.longitude,
            );
            placesUserSubscribedTo.value = response.data;
          },
          {
            errorMessageKey: 'dataFetchingError',
          },
      );
    };
    const refresh = async(event) => {
      showSkeleton.value = true;

      if(sortBy.value === 'distance') {
        await checkForLocationPermission();
      }
      await tryGettingLocation();

      await getSubscriptions();
      store.dispatch("user/getSubscriptions");
      store.dispatch("user/getFavoritePlaces");

      event.target.complete();

      showSkeleton.value = false;
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
    const showAlert = async(place, event) => {
      event?.stopPropagation();

      const alert = await alertController
          .create({
            header: t('alertUnsubscribeHeader', {
              place: place.name,
            }),
            message: t('alertUnsubscribeMessage', {
              place: place.name,
            }),
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: () => {
                  unsubscribe(place.id);

                  fullSwipeLeft(event.target.parentElement.parentElement.parentElement.firstChild);
                  shrinkToMiddle(event.target.parentElement.parentElement.parentElement);

                  showSuccessToast(t('successUnsubscribe', { place: place.name }));
                },
              },
            ],
          });
      await alert.present();
    };
    const unsubscribe = async(placeId) => {
      await tryCatch(
          async() => {
            await PlaceService.unsubscribe(placeId);

            placesUserSubscribedTo.value = placesUserSubscribedTo.value.filter((place) => {
              return place.id !== placeId;
            });

            store.commit("user/REMOVE_SUBSCRIPTION", placeId);
          },
          null,
          'generalAlertError',
      );
    };
    const unsubscribeSwiping = (place, event) => {
      timeLeftText = document.getElementById('expiryText' + place.id)?.innerHTML.split(' ');

      fullSwipeLeft(event.target.parentElement.firstChild);
      shrinkToMiddle(event.target.parentElement);

      unsubscribe(place.id, event);

      Haptics.impact({ style: ImpactStyle.Heavy });

      showUndoToast(t('successUnsubscribe', { place: place.name }), async() => {
        await tryCatch(
            async() => {
              const notifyIn = timeLeftText?.length > 0 ? timeLeftText[0] : null;

              await PlaceService.subscribe(place.id, notifyIn);

              store.commit("user/ADD_SUBSCRIPTION", place.id);
            },
            {
              errorMessageKey: 'generalAlertError',
            },
        );

        await getSubscriptions();
      });
    };
    const removeExpiredSubscription = (placeId) => {
      placesUserSubscribedTo.value = placesUserSubscribedTo.value.filter(place => place.id !== placeId);
    };

    /* Watchers */
    store.subscribeAction((action) => {
      if(action.type === "user/removeFavoritePlace" && sortBy.value === 'favorites') {
        const indexToRemove = placesUserSubscribedTo.value.findIndex(place => place.id === action.payload.id);
        if(indexToRemove > -1) {
          placesUserSubscribedTo.value.splice(indexToRemove, 1);
        }
      }
      if(action.type === "user/addFavoritePlace" && sortBy.value === 'favorites') {
        if(store.getters["user/isSubscribedTo"](action.payload.id)) {
          placesUserSubscribedTo.value.push(action.payload);
        }
      }
    });
    watch(newestNotificationPayload, () => {
      if(newestNotificationPayload.value?.id && !isModalOpen.value) {
        openModal(
            true,
            placesUserSubscribedTo.value.find(place => place.id === Number(newestNotificationPayload.value.id)),
        );
      }
    });

    return {
      /* Component properties */
      placesUserSubscribedTo,
      userHasSubscriptions,
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
      refresh,
      unsubscribeSwiping,
      removeExpiredSubscription,
      closeOpenItems,

      /* Icons */
      bookmark,
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
  background: transparent;
  --background: transparent;
}

ion-item-options {
  --border-style: none;
  background-color: #e01b43 !important;
  border-radius: 20px !important;
  margin-top: 1px !important;
}

ion-item-option {
  --border-style: none;
  --background: #e01b43;
  background: #e01b43;
  border-radius: 0 17px 17px 0 !important;
}

ion-item-option:active {
  background: #d95c75;
}
</style>