<template>
  <div>
    <FilterCategoryHeading :title="$t('searchResults')" class="mb-2"/>
    <div
        v-show="!showSkeleton"
        :class="{ 'pb-6' : isInfiniteScrollDisabled }"
    >
      <div v-for="place in places" :key="place.id" class="mb-5">
        <PlaceCard
            :place="place"
            @click="$emit('openPlaceModal', place)"
        />
      </div>
    </div>

    <div v-show="showSkeleton">
      <div v-for="i in 15" :key="i" class="mb-5">
        <PlaceCardSkeleton></PlaceCardSkeleton>
      </div>
    </div>
  </div>

  <ion-infinite-scroll
      id="infinite-scroll"
      threshold="100px"
      :disabled="isInfiniteScrollDisabled"
      @ionInfinite="loadMorePlaces($event)"
  >
    <ion-infinite-scroll-content
        class="mt-6"
        loading-spinner="dots"
    >
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</template>

<script>
import { defineComponent, ref, watch, toRefs, onMounted } from 'vue';
import { useStore }                                       from 'vuex';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
}                                                         from '@ionic/vue';

import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import PlaceCard             from '@/components/place/PlaceCard';
import PlaceCardSkeleton     from '@/components/place/PlaceCardSkeleton';

import PlaceService from '@/services/PlaceService';

import { useGeolocation }   from '@/composables/useGeolocation';
import { useErrorHandling } from '@/composables/useErrorHandling';

export default defineComponent({
  name: "PlaceInfiniteScroll",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    FilterCategoryHeading,
    PlaceCard,
    PlaceCardSkeleton,
  },
  props: {
    placeSearchTerm: {
      type: String,
      default: '',
    },
    sortBy: {
      type: String,
      default: '',
    },
    refresher: {
      type: Object,
    },
  },
  emits: ['mounted', 'scrollToTop', 'openPlaceModal', 'infiniteScrollToggle'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();
    /* Component properties */
    const places = ref([]);
    const { placeSearchTerm } = toRefs(props);
    const { sortBy } = toRefs(props);
    const isInfiniteScrollDisabled = ref(false);
    const showSkeleton = ref(true);
    // From which number on to take place records
    let placeOffset = 0;

    /* Lifecycle hooks */
    //*Before mounting fetching initial 10 places to show
    onMounted(async() => {
      await getPlaces();
      showSkeleton.value = false;

      emit('mounted');
    });

    /* Composables */
    const { position, checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const { tryCatch } = useErrorHandling();

    /* Methods */
    const getPlaces = async(concat = false) => {
      await tryCatch(
          async() => {
            const response = await PlaceService.index(
                true,
                sortBy.value,
                placeSearchTerm.value,
                placeOffset,
                10,
                position.value.latitude,
                position.value.longitude,
            );

            if(!response.data) {
              isInfiniteScrollDisabled.value = true;
              return;
            }
            if(response.data.length < 10) {
              isInfiniteScrollDisabled.value = true;
            }

            if(concat) {
              places.value = places.value.concat(response.data);
            }else {
              places.value = response.data;
            }
          },
          null,
          'dataFetchingError',
      );
    };
    const refresh = async(event) => {
      if(sortBy.value === 'distance') {
        await checkForLocationPermission();
      }
      await tryGettingLocation();

      await getPlaces();

      event.target.complete();

      placeOffset = 0;
      isInfiniteScrollDisabled.value = false;
    };

    /* Event handlers */
    const loadMorePlaces = async(e) => {
      emit('infiniteScrollToggle');
      placeOffset += 10;
      await getPlaces(true);
      emit('infiniteScrollToggle');

      e?.target.complete();
    };

    /* Watchers */
    // Watching for a change on placeSearchTerm(search term from search input) prop
    // resetting all the variables for filtered data and loading first 10 records from new filtered data
    watch(placeSearchTerm, async() => {
      isInfiniteScrollDisabled.value = false;
      placeOffset = 0;
      getPlaces();
      emit('scrollToTop');
    });
    // Watching for a change on sortBy(term for sorting records) prop
    // when new button for sorting is clicked initial 10 places are changed to appear correctly
    // (be sorted) on initial view show
    watch(sortBy, async() => {
      if(sortBy.value === 'distance') {
        await checkForLocationPermission();
      }
      await tryGettingLocation();

      isInfiniteScrollDisabled.value = false;
      placeOffset = 0;
      getPlaces();
      emit('scrollToTop');
    });
    watch(props.refresher, async() => {
      if(props.refresher.isActive) {
        await refresh(props.refresher.event);
      }
    });
    store.subscribeAction((action) => {
      if(action.type === "user/removeFavoritePlace" && sortBy.value === 'favorites') {
        const indexToRemove = places.value.findIndex(place => place.id === action.payload.id);
        if(indexToRemove > -1) {
          places.value.splice(indexToRemove, 1);
        }
      }

      if(action.type === "user/addFavoritePlace" && sortBy.value === 'favorites') {
        places.value.push(action.payload);
      }
    });

    return {
      /* Component properties */
      places,
      isInfiniteScrollDisabled,
      showSkeleton,

      /* Event handlers */
      loadMorePlaces,
      refresh,

      /* Icons */
      // @ionInfinite="loadMorePlaces($event)"

    };
  },
});
</script>
<style scoped>

</style>