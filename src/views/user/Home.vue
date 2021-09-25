<template>
  <ion-page>
    <ion-content>
      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <UserHeader
          :main-heading="$t('findAvailablePlace')"
          :notification-icon="notificationsOutline"
          @search-enter-pressed="switchToSearch"
      />

      <div class="ion-padding">
        <FilterCategoryHeading class="mb-2" :title="$t('closest')"/>
        <ion-slides v-show="!showSkeleton" :options="slideOpts">
          <ion-slide>
            <SlidingCards
                :cafes="cafes.closestToUser?.slice(0, 2)"
                @open-cafe-modal="openModal(true, $event)"
                class="pr-3"
            />
          </ion-slide>
          <ion-slide>
            <SlidingCards
                :cafes="cafes.closestToUser?.slice(2, 4)"
                @open-cafe-modal="openModal(true, $event)"
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
            <SlidingCards
                :cafes="cafes.currentlyAvailable?.slice(0, 2)"
                @open-cafe-modal="openModal(true, $event)"
                class="pr-3"
            />
          </ion-slide>
          <ion-slide>
            <SlidingCards
                :cafes="cafes.currentlyAvailable?.slice(2, 4)"
                @open-cafe-modal="openModal(true, $event)"
                class="pr-3"
            />
          </ion-slide>
        </ion-slides>

        <FilterCategoryHeading class="mb-2" :title="$t('food')"/>
        <ion-slides v-show="!showSkeleton" :options="slideOpts">
          <ion-slide>
            <SlidingCards
                :cafes="cafes.haveFood?.slice(0, 2)"
                @open-cafe-modal="openModal(true, $event)"
                class="pr-3"
            />
          </ion-slide>
          <ion-slide>
            <SlidingCards
                :cafes="cafes.haveFood?.slice(2, 4)"
                @open-cafe-modal="openModal(true, $event)"
                class="pr-3"
            />
          </ion-slide>
        </ion-slides>

        <div v-if="showSkeleton">
          <SkeletonCafeCard class="mb-2"></SkeletonCafeCard>
          <SkeletonCafeCard></SkeletonCafeCard>
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
        />
      </Modal>
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
  IonSlides,
  IonSlide,
  IonRefresher,
  IonRefresherContent,
  onIonViewDidEnter,
}                                                    from '@ionic/vue';

import CafeService from '@/services/CafeService';

import UserHeader            from '@/components/user/headers/UserHeader';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import SlidingCards          from '@/components/place/SlidingCards';
import SkeletonCafeCard      from '@/components/place/SkeletonCafeCard';
import Modal                 from '@/components/Modal';
import ShortCafeModal        from '@/components/user/modals/ShortCafeModal';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useGeolocation }        from '@/composables/useGeolocation';
import { useModal }              from '@/composables/useModal';

import { notificationsOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonSlides,
    IonSlide,
    IonRefresher,
    IonRefresherContent,
    UserHeader,
    FilterCategoryHeading,
    SlidingCards,
    Modal,
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
      closestToUser: [],
      currentlyAvailable: [],
      haveFood: [],
    });
    const showSkeleton = ref(true);

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const { isModalOpen, modalData, openModal, hideModal } = useModal();

    /* Lifecycle hooks */
    // Because getting lat and lng takes long tame wait for it to happen and then hit API with correct lat and lng values
    const unwatch = store.watch(
        (state, getters) => getters['global/position'],
        async() => {
          try {
            const response = await CafeService.getCafeCardsChunkInfo(
                0, 4,
                '', 'distance', true,
                store.getters['global/position'].latitude,
                store.getters['global/position'].longitude,
            );

            cafes.closestToUser = response.data;

            unwatch();
          }catch(error) {
            showErrorToast(
                null,
                {
                  pushNotificationPermission: t('dataFetchingError'),
                });
          }
        },
    );

    //Before fetching cafes by distance get location and then pass it to query string in API call to backend
    onMounted(async() => {
      await getFilteredCafes();
      showSkeleton.value = false;
    });
    onIonViewDidEnter(() => {
      openModal(!!route.query.openModal);
    });

    /* Methods */
    const getFilteredCafes = async() => {
      try {
        const response = await Promise.all([
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
        ]);

        cafes.closestToUser = response[0].data;
        cafes.currentlyAvailable = response[1].data;
        cafes.haveFood = response[2].data;
      }catch(error) {
        showErrorToast(
            null,
            {
              pushNotificationPermission: t('dataFetchingError'),
            });
      }
    };

    /* Event handlers */
    const switchToSearch = (e) => {
      router.push({ path: 'search', query: { searchTerm: e.target.value } });
      //Clearing search input after leaving page
      e.target.value = null;
    };
    const refresh = async(event) => {
      await checkForLocationPermission();
      await tryGettingLocation();

      await getFilteredCafes();
      event.target.complete();
    };

    return {
      /* Global properties */
      /* Component properties */
      slideOpts,
      cafes,
      isModalOpen,
      modalData,
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
ion-refresher-content {
  margin-top: 3px !important;
}
</style>
