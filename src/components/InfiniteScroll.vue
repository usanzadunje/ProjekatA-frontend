<template>
  <div>
    <ion-refresher pull-max="0" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
      <ion-refresher-content
          :pulling-text="$t('refresherPulling')"
          refreshing-spinner="crescent"
          :refreshing-text="$t('refresherText')"
      >
      </ion-refresher-content>
    </ion-refresher>
    <FilterCategoryHeading :title="$t('searchResults')" class="mb-2"/>
    <div v-if="!showSkeleton">
      <div v-for="cafe in cafes" :key="cafe.id" class="mb-5">
        <CafeCard
            :cafe="cafe"
            @click="$emit('openCafeModal', cafe)"
        />
      </div>
    </div>

    <div v-if="showSkeleton">
      <div v-for="i in 15" :key="i" class="mb-5">
        <SkeletonCafeCard></SkeletonCafeCard>
      </div>
    </div>
  </div>

  <ion-infinite-scroll
      @ionInfinite="loadData($event)"
      threshold="100px"
      id="infinite-scroll"
      :disabled="isInfiniteScrollDisabled"
  >
    <ion-infinite-scroll-content
        class="mt-6"
        loading-spinner="crescent"
        :loading-text="$t('refresherText')">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</template>

<script>
import { defineComponent, ref, watch, toRefs, onMounted } from 'vue';
import { useStore }                                       from 'vuex';
import { useI18n }                                        from 'vue-i18n';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonRefresher,
  IonRefresherContent,
}                                                         from '@ionic/vue';

import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import CafeCard              from '@/components/user/CafeCard';
import SkeletonCafeCard      from '@/components/user/SkeletonCafeCard';

import CafeService from '@/services/CafeService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useGeolocation }        from '@/composables/useGeolocation';

export default defineComponent({
  name: "InfiniteScroll",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
    FilterCategoryHeading,
    CafeCard,
    SkeletonCafeCard,
  },
  props: {
    cafeSearchString: {
      type: String,
      default: '',
    },
    sortBy: {
      type: String,
      default: '',
    },
  },
  emits: ['scrollToTop', 'openCafeModal', 'infiniteScrollActive'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();
    /* Component properties */
    // All non filtered cafes
    const cafes = ref([]);
    // Initial 20 cafes that are shown when no filters are applied
    let initial20Cafes = null;
    // Search term for filtering records
    const { cafeSearchString } = toRefs(props);
    // Term for sorting records in specific order
    const { sortBy } = toRefs(props);
    // From which number on to take cafe records
    let cafeStart = 0;
    // Property to enable / disable loading infinite scroll animation and action
    const isInfiniteScrollDisabled = ref(false);
    const showSkeleton = ref(true);

    /* Lifecycle hooks */
    //*Before mounting fetching initial 20 cafes to show
    onMounted(() => {
      CafeService.getCafeCardsChunkInfo(
          cafeStart, 20,
          cafeSearchString.value, sortBy.value, true,
          store.getters['global/position'].latitude,
          store.getters['global/position'].longitude,
      )
                 .then((response) => {
                   cafes.value = response.data;
                   showSkeleton.value = false;
                   initial20Cafes = response.data;
                 })
                 .catch((error) => {
                   showSkeleton.value = false;
                   if(error.response && error.response.status !== 404) {
                     showErrorToast(
                         null,
                         {
                           pushNotificationPermission: t('dataFetchingError'),
                         });
                   }
                   CafeService.getCafeCardsChunkInfo(cafeStart, 20, cafeSearchString.value, 'default', true, 0, 0)
                              .then((response) => {
                                cafes.value = response.data;
                                initial20Cafes = response.data;
                                sortBy.value = 'default';
                              })
                              .catch(() => {
                                showSkeleton.value = false;
                                showErrorToast(
                                    null,
                                    {
                                      pushNotificationPermission: t('dataFetchingError'),
                                    });
                              });
                 });
    });

    /* Methods */
    // Grabbing 20 more cafes that match required filter
    const loadMoreCafes = () => {
      cafeStart += 20;
      CafeService.getCafeCardsChunkInfo(
          cafeStart, 20,
          cafeSearchString.value, sortBy.value, true,
          store.getters['global/position'].latitude,
          store.getters['global/position'].longitude,
      )
                 .then((response) => {
                   // There are no more records
                   if(response.data === 'false') {
                     isInfiniteScrollDisabled.value = true;
                     return;
                   }
                   if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                   cafes.value = cafes.value.concat(response.data);
                 })
                 .catch((error) => {
                   isInfiniteScrollDisabled.value = true;
                   if(error.response && error.response.status !== 404) {
                     showErrorToast(
                         null,
                         {
                           pushNotificationPermission: t('dataFetchingError'),
                         });
                   }
                 });

    };
    const filterCafes = async(ignoreIfNoSearchTerm = false) => {
      //If there is no search term all cafes are returned
      if(!cafeSearchString.value && !ignoreIfNoSearchTerm) {
        return cafes.value = initial20Cafes;
      }

      setTimeout(() => {
        CafeService.getCafeCardsChunkInfo(
            cafeStart, 20,
            cafeSearchString.value, sortBy.value, true,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        )
                   .then((response) => {
                     if(!response.data) return;
                     if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                     cafes.value = response.data;
                   })
                   .catch((error) => {
                     if(error.response && error.response.status !== 404) {
                       showErrorToast(
                           null,
                           {
                             pushNotificationPermission: t('dataFetchingError'),
                           });
                     }
                   });
      }, 300);

    };
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();
    const refresh = async(event) => {
      await checkForLocationPermission();
      await tryGettingLocation();
      // Only after both cafe arrays have been updated then complete refresher
      // Fetching 4 cafes in each category with new live data
      CafeService.getCafeCardsChunkInfo(
          cafeStart, 20,
          cafeSearchString.value, sortBy.value, true,
          store.getters['global/position'].latitude,
          store.getters['global/position'].longitude,
      )
                 .then((response) => {
                   cafes.value = response.data;
                   initial20Cafes = response.data;

                   event.target.complete();
                 })
                 .catch((error) => {
                   if(error.response && error.response.status !== 404) {
                     showErrorToast(
                         null,
                         {
                           pushNotificationPermission: t('dataFetchingError'),
                         });

                     event.target.complete();
                   }
                   CafeService.getCafeCardsChunkInfo(cafeStart, 20, cafeSearchString.value, 'default', true, 0, 0)
                              .then((response) => {
                                cafes.value = response.data;
                                initial20Cafes = response.data;
                                sortBy.value = 'default';

                                event.target.complete();
                              })
                              .catch(() => {
                                showErrorToast(
                                    null,
                                    {
                                      pushNotificationPermission: t('dataFetchingError'),
                                    });
                                event.target.complete();
                              });
                 });
    };

    /* Event handlers */
    const loadData = (ev) => {
      emit('infiniteScrollActive');
      setTimeout(() => {
        loadMoreCafes();
        ev.target.complete();
        emit('infiniteScrollActive');
      }, 300);
    };

    /* Watchers */
    // Watching for a change on cafeSearchString(search term from search input) prop
    // resetting all the variables for filtered data and loading first 20 records from new filtered data
    watch(cafeSearchString, () => {
      isInfiniteScrollDisabled.value = false;
      cafeStart = 0;
      filterCafes();
      emit('scrollToTop');
    });
    // Watching for a change on sortBy(term for sorting records) prop
    // when new button for sorting is clicked initial 20 cafes are changed to appear correctly
    // (be sorted) on initial view show
    watch(sortBy, async() => {
      if(sortBy.value === 'distance') {
        await checkForLocationPermission();
      }
      await tryGettingLocation();

      isInfiniteScrollDisabled.value = false;
      cafeStart = 0;
      filterCafes(true);
      emit('scrollToTop');
    });


    return {
      /* Component properties */
      cafes,
      isInfiniteScrollDisabled,
      showSkeleton,

      /* Event handlers */
      loadMoreCafes,
      loadData,
      refresh,

      /* Icons */

    };
  },
});
</script>