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

      <div class="ion-padding mb-10">
        <FilterCategoryHeading
            class="mb-2"
            :title="$t('closest')"
            :icon="locationSharp"
        />
        <PlaceCardSlider
            :places="places.closestToUser"
            :show-skeleton="showSkeleton"
            @open-place-modal="openModal(true, $event)"
        />

        <div v-if="this.$store.getters['auth/loggedIn']">
          <FilterCategoryHeading
              class="mb-2"
              :title="$t('favorite', 2)"
              :icon="starSharp"
          />
          <PlaceCardSlider
              v-if="places.favorites.length !== 0"
              :places="places.favorites"
              :show-skeleton="showSkeleton"
              @open-place-modal="openModal(true, $event)"
          />
          <div
              v-else
              v-show="!showSkeleton"
              class="primary-text-color text-xs mb-2"
          >
            {{ $t('noFavoritePlaces1') }}
            <ion-icon
                :icon="starOutline"
                class="text-yellow-400"
            ></ion-icon>
            {{ $t('noFavoritePlaces2') }}
          </div>
        </div>

        <FilterCategoryHeading
            class="mb-2"
            :title="$t('currently')"
            :icon="ellipseOutline"
        />
        <PlaceCardSlider
            :places="places.currentlyAvailable"
            :show-skeleton="showSkeleton"
            @open-place-modal="openModal(true, $event)"
        />

        <FilterCategoryHeading
            class="mb-2"
            :title="$t('food')"
            :icon="pizzaSharp"
        />
        <PlaceCardSlider
            :places="places.haveFood"
            :show-skeleton="showSkeleton"
            @open-place-modal="openModal(true, $event)"
        />
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
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute }                                        from 'vue-router';
import { useStore }                                                   from 'vuex';
import {
  IonContent,
  IonPage,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  onIonViewDidEnter,
}                                                                     from '@ionic/vue';

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

import {
  starOutline,
  locationSharp,
  starSharp,
  pizzaSharp,
  ellipseOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'UserHome',
  components: {
    IonContent,
    IonPage,
    IonIcon,
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
      favorites: [],
      currentlyAvailable: [],
      haveFood: [],
    });
    const showSkeleton = ref(true);
    const loggedIn = computed(() => store.getters['auth/loggedIn']);

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
              {
                errorMessageKey: 'dataFetchingError',
              },
          );
        },
    );

    //Before fetching places by distance get location and then pass it to query string in API call to backend
    onMounted(async() => {
      await getFilteredPlaces();
      showSkeleton.value = false;
    });
    onIonViewDidEnter(() => {
      //Safety check, do not open modal if there is no data to be shown inside it
      if(modalData.value) {
        openModal(!!route.query.openModal);
      }
    });

    /* Methods */
    const getFilteredPlaces = async() => {
      const promises = [
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

        ...loggedIn.value ?
            [
              PlaceService.index(
                  true,
                  'favorites',
                  '',
                  0,
                  4,
                  position.value.latitude,
                  position.value.longitude,
              ),
            ] :
            [],
      ];
      await tryCatch(
          async() => {
            const response = await Promise.all(promises);

            places.closestToUser = response[0].data;
            places.currentlyAvailable = response[1].data;
            places.haveFood = response[2].data;

            if(promises.length === 4) {
              places.favorites = response[3].data;
            }

          },
          {
            errorMessageKey: 'dataFetchingError',
          },
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
      store.dispatch("user/getFavoritePlaces");

      event.target.complete();
      showSkeleton.value = false;
    };

    /* Watchers */
    watch(loggedIn, async() => {
      if(loggedIn.value) {
        await tryCatch(
            async() => {
              const response = await PlaceService.index(
                  true,
                  'favorites',
                  '',
                  0,
                  4,
                  position.value.latitude,
                  position.value.longitude,
              );

              places.favorites = response.data;
            },
            {
              errorMessageKey: 'dataFetchingError',
            },
        );
      }
    });
    store.subscribeAction((action) => {
      if(action.type === "user/removeFavoritePlace") {
        const indexToRemove = places.favorites.findIndex(place => place.id === action.payload.id);
        if(indexToRemove > -1) {
          places.favorites.splice(indexToRemove, 1);
        }
      }

      if(action.type === "user/addFavoritePlace") {
        places.favorites.push(action.payload);
      }
    });

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

      /* Icons */
      starOutline,
      locationSharp,
      starSharp,
      pizzaSharp,
      ellipseOutline,
    };
  },
});
</script>
<style>
ion-refresher-content {
  margin-top: 3px !important;
}
</style>
