<template>
  <ion-page>
    <UserProfileHeader/>

    <ion-content class="ion-padding no-padding-top">
      <ion-refresher pull-min="45" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            :pulling-text="$t('refresherPulling')"
            refreshing-spinner="crescent"
            :refreshing-text="$t('refresherText')"
        >
        </ion-refresher-content>
      </ion-refresher>
      <SlidingFilter @sortHasChanged="sortHasChanged" class="mt-2"/>

      <div class="mt-3">
        <FilterCategoryHeading title="Kafici koje pratim" class="mb-2"/>

        <div v-if="!showSkeleton">
          <ion-item-sliding v-for="cafe in cafesUserSubscribedTo" :key="cafe.id" class="ion-no-padding mb-5">
            <ion-item class="ion-no-padding ion-no-margin">
              <CafeCard
                  class="w-full"
                  :cafe="cafe"
                  @click="openModal(true, cafe)"
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

        <div v-if="showSkeleton">
          <div v-for="i in 5" :key="i" class="mb-5">
            <SkeletonCafeCard></SkeletonCafeCard>
          </div>
        </div>
      </div>

      <ion-modal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @didDismiss="openModal(false);"
          :backdrop-dismiss="true"
          :swipe-to-close="true"
      >
        <ShortCafeModal
            :cafe="modalCafe"
            @dismissShortCafeModal="openModal(false)"
            @subModalOpened="hideModal"
            @userUnsubscribed="getSubscriptions"
        />
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute }                        from 'vue-router';
import { mapGetters, useStore }            from 'vuex';
import { useI18n }                         from 'vue-i18n';
import {
  IonContent,
  IonPage,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  alertController,
  IonModal,
  IonRefresher,
  IonRefresherContent,
  onIonViewDidEnter,
}                                          from '@ionic/vue';

import UserProfileHeader     from '@/components/user/UserProfileHeader';
import SlidingFilter         from '@/components/user/SlidingFilter';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import CafeCard              from '@/components/user/CafeCard';
import ShortCafeModal        from '@/components/user/ShortCafeModal';
import SkeletonCafeCard      from '@/components/user/SkeletonCafeCard';

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
    IonModal,
    IonRefresher,
    IonRefresherContent,
    UserProfileHeader,
    SlidingFilter,
    FilterCategoryHeading,
    CafeCard,
    ShortCafeModal,
    SkeletonCafeCard,
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  setup() {
    /* Global properties */
    const store = useStore();
    const { t } = useI18n();
    const route = useRoute();

    /* Component properties */
    // Cafes user is subscribed to
    const cafesUserSubscribedTo = ref([]);
    const sortBy = ref('distance');
    const showSkeleton = ref(true);

    /* Composables */
    const { showUndoToast, showSuccessToast, showErrorToast } = useToastNotifications();
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const { isModalOpen, modalCafe, openModal, hideModal } = useModal();

    /* Lifecycle hooks */
    //Setting options for slider inside SlideFilter component
    onMounted(async() => {
      await getSubscriptions();
      showSkeleton.value = false;
    });
    onIonViewDidEnter(async() => {
      openModal(!!route.query.openModal);
      // Everytime user comes to the page give him view of fresh cafes he has subscribed to
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
                  showSuccessToast(t('successSubscribe'));
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
        //POTREBNO PROSLEDITI VREME KOJE JE OSTALO KADA JE UNSUB KAO TIMER DO ISTEKA NOTIFIKOVANJA
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


    return {
      /* Component properties */
      cafesUserSubscribedTo,
      sortBy,
      isModalOpen,
      modalCafe,
      showSkeleton,

      /* Event handlers */
      sortHasChanged,
      showAlert,
      openModal,
      getSubscriptions,
      hideModal,
      refresh,
      unsubscribeSwiping,

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
  --background: #E01B43;
  border-top-right-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}

ion-item-option:active {
  --background: #E01B43;
}

/*ion-content {*/
/*  --padding-top: 0;*/
/*}*/
</style>