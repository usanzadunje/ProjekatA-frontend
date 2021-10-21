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
          @search-enter-pressed="switchToSearch"
      />
      <div class="ion-padding">
        <FilterCategoryHeading class="mb-2" :title="$t('closest')"/>
        <SlidingCards
            :places="places.closestToUser?.slice(0, 4)"
            :show-skeleton="showSkeleton"
            @open-place-modal="openModal(true, $event)"
        />

        <FilterCategoryHeading class="mb-2" :title="$t('currently')"/>
        <SlidingCards
            :places="places.currentlyAvailable?.slice(0, 4)"
            :show-skeleton="showSkeleton"
            @open-place-modal="openModal(true, $event)"
        />

        <FilterCategoryHeading class="mb-2" :title="$t('food')"/>
        <SlidingCards
            :places="places.haveFood?.slice(0, 4)"
            :show-skeleton="showSkeleton"
            @open-place-modal="openModal(true, $event)"
        />
      </div>

      <Modal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @didDismiss="openModal(false);"
      >
        <PlaceInfoModal
            :place="modalData"
            @dismiss-place-info-modal="openModal(false)"
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
  IonRefresher,
  IonRefresherContent,
  onIonViewDidEnter,
}                                                    from '@ionic/vue';

import PlaceService from '@/services/PlaceService';

import UserHeader            from '@/components/user/headers/UserHeader';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import SlidingCards          from '@/components/place/SlidingCards';
import Modal                 from '@/components/Modal';
import PlaceInfoModal        from '@/components/user/modals/PlaceInfoModal';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useGeolocation }        from '@/composables/useGeolocation';
import { useModal }              from '@/composables/useModal';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    UserHeader,
    FilterCategoryHeading,
    SlidingCards,
    Modal,
    PlaceInfoModal,
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
    const places = reactive({
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
            const response = await PlaceService.index(
                true,
                'distance',
                '',
                0,
                4,
                store.getters['global/position'].latitude,
                store.getters['global/position'].longitude,
            );

            places.closestToUser = response.data;

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

    //Before fetching places by distance get location and then pass it to query string in API call to backend
    onMounted(async() => {
      await getFilteredPlaces();
      showSkeleton.value = false;
    });
    onIonViewDidEnter(() => {
      openModal(!!route.query.openModal);
    });

    /* Methods */
    const getFilteredPlaces = async() => {
      try {
        const response = await Promise.all([
          PlaceService.index(
              true,
              'distance',
              '',
              0,
              4,
              store.getters['global/position'].latitude,
              store.getters['global/position'].longitude,
          ),

          PlaceService.index(
              true,
              'availability',
              '',
              0,
              4,
              store.getters['global/position'].latitude,
              store.getters['global/position'].longitude,
          ),

          PlaceService.index(
              true,
              'food',
              '',
              0,
              4,
              store.getters['global/position'].latitude,
              store.getters['global/position'].longitude,
          ),
        ]);

        places.closestToUser = response[0].data;
        places.currentlyAvailable = response[1].data;
        places.haveFood = response[2].data;
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
      showSkeleton.value = true;
      await checkForLocationPermission();
      await tryGettingLocation();

      await getFilteredPlaces();
      event.target.complete();
      showSkeleton.value = false;
    };

    return {
      /* Global properties */
      /* Component properties */
      places,
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
    };
  },
});
</script>
<style>
ion-refresher-content {
  margin-top: 3px !important;
}
</style>
