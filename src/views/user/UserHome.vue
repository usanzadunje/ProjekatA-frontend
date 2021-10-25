<template>
  <ion-page>
    <AppSlideUpWrapper>
      <TheUserHeader
          id="homeHeader"
          v-show="showElement"
          :main-heading="$t('findAvailablePlace')"
          @search-enter-pressed="switchToSearch"
      />
    </AppSlideUpWrapper>
    <ion-content
        :fullscreen="true"
        :scroll-events="true"
        @ionScroll="pullAnimation($event)"
    >
      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>


      <div class="ion-padding">
        <div class="pb-6">
          <FilterCategoryHeading class="mb-2" :title="$t('closest')"/>
          <PlaceCardSlider
              :places="places.closestToUser?.slice(0, 4)"
              :show-skeleton="showSkeleton"
              @open-place-modal="openModal(true, $event)"
          />

          <FilterCategoryHeading class="mb-2" :title="$t('currently')"/>
          <PlaceCardSlider
              :places="places.currentlyAvailable?.slice(0, 4)"
              :show-skeleton="showSkeleton"
              @open-place-modal="openModal(true, $event)"
          />

          <FilterCategoryHeading class="mb-2" :title="$t('food')"/>
          <PlaceCardSlider
              :places="places.haveFood?.slice(0, 4)"
              :show-skeleton="showSkeleton"
              @open-place-modal="openModal(true, $event)"
          />
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
        />
      </AppModal>
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

import AppSlideUpWrapper     from '@/components/AppSlideUpWrapper';
import TheUserHeader         from '@/components/user/headers/TheUserHeader';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import PlaceCardSlider       from '@/components/place/PlaceCardSlider';
import AppModal              from '@/components/AppModal';
import PlaceInfoModal        from '@/components/user/modals/PlaceInfoModal';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useGeolocation }        from '@/composables/useGeolocation';
import { useModal }              from '@/composables/useModal';
import { useRefresher }          from '@/composables/useRefresher';
import { slideUp }               from '@/composables/useAnimations';

export default defineComponent({
  name: 'UserHome',
  components: {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    AppSlideUpWrapper,
    TheUserHeader,
    FilterCategoryHeading,
    PlaceCardSlider,
    AppModal,
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
    const { isModalOpen, modalData, openModal } = useModal();
    const { forceStopRefresherAfter } = useRefresher();
    const { showElement, pullAnimation } = slideUp('homeHeader');

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
                  dataFetchingError: t('dataFetchingError'),
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
              dataFetchingError: t('dataFetchingError'),
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
      try {
        await checkForLocationPermission();
        await tryGettingLocation();

        await getFilteredPlaces();
      }catch(e) {
        showErrorToast(
            null,
            {
              dataFetchingError: t('dataFetchingError'),
            });
      }finally {
        forceStopRefresherAfter(event);

        event.target.complete();
        showSkeleton.value = false;
      }
    };

    return {
      /* Global properties */
      /* Component properties */
      places,
      isModalOpen,
      modalData,
      showSkeleton,
      showElement,

      /* Event handlers */
      openModal,
      switchToSearch,
      refresh,
      pullAnimation,

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
