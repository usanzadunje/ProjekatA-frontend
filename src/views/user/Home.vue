<template>
  <ion-page>
    <UserHeader
        :mainHeading="$t('findAvailablePlace')"
        :notificationIcon="notificationsOutline"
        @searchEnterPressed="switchToSearch"
    />

    <ion-content class="ion-padding">
      <ion-refresher pull-min="45" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            :pulling-text="$t('refresherPulling')"
            refreshing-spinner="crescent"
            :refreshing-text="$t('refresherText')"
        >
        </ion-refresher-content>
      </ion-refresher>
      <FilterCategoryHeading class="mb-2" :title="$t('closest')"/>
      <ion-slides v-show="!showSkeleton" :options="slideOpts">
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.closestToUser.slice(0, 2)"
              @openCafeModal="openModal(true, $event)"
              class="pr-3"
          />
        </ion-slide>
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.closestToUser.slice(2, 4)"
              @openCafeModal="openModal(true, $event)"
              class="pr-3"
          />
        </ion-slide>
      </ion-slides>

      <div v-if="showSkeleton">
        <SkeletonCafeCard class="mb-2"></SkeletonCafeCard>
        <SkeletonCafeCard class="mb-2"></SkeletonCafeCard>
      </div>

      <FilterCategoryHeading class="mb-2" :title="$t('currently')"/>
      <ion-slides v-show="!showSkeleton" :options="slideOpts">
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.currentlyAvailable.slice(0, 2)"
              @openCafeModal="openModal(true, $event)"
              class="pr-3"
          />
        </ion-slide>
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.currentlyAvailable.slice(2, 4)"
              @openCafeModal="openModal(true, $event)"
              class="pr-3"
          />
        </ion-slide>
      </ion-slides>

      <FilterCategoryHeading class="mb-2" :title="$t('food')"/>
      <ion-slides v-show="!showSkeleton" :options="slideOpts">
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.haveFood.slice(0, 2)"
              @openCafeModal="openModal(true, $event)"
              class="pr-3"
          />
        </ion-slide>
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.haveFood.slice(2, 4)"
              @openCafeModal="openModal(true, $event)"
              class="pr-3"
          />
        </ion-slide>
      </ion-slides>

      <div v-if="showSkeleton">
        <SkeletonCafeCard class="mb-2"></SkeletonCafeCard>
        <SkeletonCafeCard></SkeletonCafeCard>
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
        />
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute }                       from 'vue-router';
import { useStore }                                  from 'vuex';
import { useI18n }                                   from 'vue-i18n';
import {
  IonContent,
  IonPage,
  IonModal,
  IonSlides,
  IonSlide,
  IonRefresher,
  IonRefresherContent,
  onIonViewDidEnter,
}                                                    from '@ionic/vue';

import CafeService from '@/services/CafeService';

import UserHeader            from '@/components/user/UserHeader';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import HomeSlidingCafeCards  from '@/components/user/HomeSlidingCafeCards';
import ShortCafeModal        from '@/components/user/ShortCafeModal';
import SkeletonCafeCard      from '@/components/user/SkeletonCafeCard';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useGeolocation }        from '@/composables/useGeolocation';
import { useModal }             from '@/composables/useModal';

import { notificationsOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonModal,
    IonSlides,
    IonSlide,
    IonRefresher,
    IonRefresherContent,
    UserHeader,
    FilterCategoryHeading,
    HomeSlidingCafeCards,
    ShortCafeModal,
    SkeletonCafeCard,
  },
  beforeRouteEnter(to) {
    // Before entering route remove query params
    if(Object.keys(to.query).length && !to.query.openModal) {
      return { path: to.path, query: {}, hash: to.hash };
    }
  },
  setup() {
    /* Global properties */
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    /* Component properties */
    const slideOpts = {
      slidesPerView: 1.1,
    };
    const cafes = reactive({
      currentlyAvailable: [],
      closestToUser: [],
      haveFood: [],
    });

    const showSkeleton = ref(true);

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const { isModalOpen, modalCafe, openModal, hideModal } = useModal();

    /* Lifecycle hooks */
    // Because getting lat and lng takes long tame wait for it to happen and then hit API with correct lat and lng values
    const unsubscribeWatcher = store.subscribe((mutation) => {
      if(mutation.type === 'global/SET_POSITION') {
        CafeService.getCafeCardsChunkInfo(
            0, 4,
            '', 'distance', true,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        ).then((response) => {
          cafes.closestToUser = response.data;

          unsubscribeWatcher();
        }).catch(() => {
          showErrorToast(
              null,
              {
                pushNotificationPermission: t('dataFetchingError'),
              });
        });
      }
    });
    //Before fetching cafes by distance get location and then pass it to query string in API call to backend
    onMounted(async() => {
      Promise.all([
        CafeService.getCafeCardsChunkInfo(
            0, 4,
            '', 'default', true,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        ),

        CafeService.getCafeCardsChunkInfo(
            0, 4,
            '', 'food', true,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        ),
      ]).then((response) => {
        openModal(true, response[0].data[0]);
        // openModal(false);

        cafes.currentlyAvailable = response[0].data;
        cafes.haveFood = response[1].data;

        showSkeleton.value = false;
      }).catch(() => {
        showErrorToast(
            null,
            {
              pushNotificationPermission: t('dataFetchingError'),
            });
      });
    });
    onIonViewDidEnter(() => {
      openModal(!!route.query.openModal);
    });

    /* Event handlers */
    const switchToSearch = (e) => {
      router.push({ path: 'search', query: { searchTerm: e.target.value } });
      //Clearing search input after leaving page
      e.target.value = null;
    };
    const refresh = async(event) => {
      await checkForLocationPermission();
      await tryGettingLocation();
      // Only after both cafe arrays have been updated then complete refresher
      // Fetching 4 cafes in each category with new live data
      Promise.all([
        CafeService.getCafeCardsChunkInfo(
            0, 4,
            '', 'distance', true,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        ),

        CafeService.getCafeCardsChunkInfo(
            0, 4,
            '', 'default', true,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        ),

        CafeService.getCafeCardsChunkInfo(
            0, 4,
            '', 'food', true,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        ),
      ]).then((response) => {
        cafes.closestToUser = response[0].data;
        cafes.currentlyAvailable = response[1].data;
        cafes.haveFood = response[2].data;

        event.target.complete();
      }).catch(() => {
        showErrorToast(
            null,
            {
              pushNotificationPermission: t('dataFetchingError'),
            });
        event.target.complete();
      });
    };

    return {
      /* Global properties */
      /* Component properties */
      slideOpts,
      cafes,
      isModalOpen,
      modalCafe,
      showSkeleton,

      /* Event handlers */
      openModal,
      hideModal,
      switchToSearch,
      refresh,

      /* Methods */

      /* Icons from */
      notificationsOutline,
    };
  },
});
</script>
<style>
ion-refresher {
  background: #F6F7FB !important;
}

ion-refresher-content {
  margin-top: 3px !important;
}
</style>
