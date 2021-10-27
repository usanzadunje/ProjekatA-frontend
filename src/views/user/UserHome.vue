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

import { useGeolocation }   from '@/composables/useGeolocation';
import { useModal }         from '@/composables/useModal';
import { slideUp }          from '@/composables/useAnimations';
import { useErrorHandling } from '@/composables/useErrorHandling';

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
    const { position, checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const { isModalOpen, modalData, openModal } = useModal();
    const { showElement, pullAnimation } = slideUp('homeHeader');
    const { tryCatch } = useErrorHandling();

    /* Lifecycle hooks */
    // Because getting lat and lng takes long tame wait for it to happen and then hit API with correct lat and lng values
    const unwatch = store.watch(
        (state, getters) => getters['global/position'],
        async() => {
          await tryCatch(
              async() => {
                const response = await PlaceService.index(
                    true,
                    'distance',
                    '',
                    0,
                    4,
                    position.value.latitude,
                    position.value.longitude,
                );

                places.closestToUser = response.data;

                unwatch();
              },
              null,
              'dataFetchingError',
          );
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
      await tryCatch(
          async() => {
            const response = await Promise.all([
              PlaceService.index(
                  true,
                  'distance',
                  '',
                  0,
                  4,
                  position.value.latitude,
                  position.value.longitude,
              ),

              PlaceService.index(
                  true,
                  'availability',
                  '',
                  0,
                  4,
                  position.value.latitude,
                  position.value.longitude,
              ),

              PlaceService.index(
                  true,
                  'food',
                  '',
                  0,
                  4,
                  position.value.latitude,
                  position.value.longitude,
              ),
            ]);

            places.closestToUser = response[0].data;
            places.currentlyAvailable = response[1].data;
            places.haveFood = response[2].data;
          },
          null,
          'dataFetchingError',
      );
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
