<template>
  <div>
    <FilterCategoryHeading :title="$t('searchResults')" class="mb-2"/>
    <div v-show="!showSkeleton">
      <div v-for="cafe in cafes" :key="cafe.id" class="mb-5">
        <CafeCard
            :place="cafe"
            @click="$emit('openCafeModal', cafe)"
        />
      </div>
    </div>

    <div v-show="showSkeleton">
      <div v-for="i in 15" :key="i" class="mb-5">
        <SkeletonCafeCard></SkeletonCafeCard>
      </div>
    </div>
  </div>

  <ion-infinite-scroll
      id="infinite-scroll"
      @ionInfinite="loadMoreCafes($event)"
      threshold="100px"
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
}                                                         from '@ionic/vue';

import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import CafeCard              from '@/components/place/CafeCard';
import SkeletonCafeCard      from '@/components/place/SkeletonCafeCard';

import CafeService from '@/services/CafeService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useGeolocation }        from '@/composables/useGeolocation';

export default defineComponent({
  name: "InfinitePlaceScroll",
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
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
    refresher: {
      type: Object,
    },
  },
  emits: ['mounted', 'scrollToTop', 'openCafeModal', 'infiniteScrollToggle'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const cafes = ref([]);
    const { cafeSearchString } = toRefs(props);
    const { sortBy } = toRefs(props);
    const isInfiniteScrollDisabled = ref(false);
    const showSkeleton = ref(true);
    // From which number on to take cafe records
    let placeOffset = 0;

    /* Lifecycle hooks */
    //*Before mounting fetching initial 10 cafes to show
    onMounted(async() => {
      await getCafes();
      showSkeleton.value = false;

      emit('mounted');
    });

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();

    /* Methods */
    const getCafes = async(concat = false) => {
      try {
        const response = await CafeService.index(
            true,
            sortBy.value,
            cafeSearchString.value,
            placeOffset,
            10,
            store.getters['global/position'].latitude,
            store.getters['global/position'].longitude,
        );

        if(!response.data) {
          isInfiniteScrollDisabled.value = true;
          return;
        }
        if(response.data.length < 10) {
          isInfiniteScrollDisabled.value = true;
        }

        if(concat) {
          cafes.value = cafes.value.concat(response.data);
        }else {
          cafes.value = response.data;
        }
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

      document.querySelector('#header').classList.remove('hide-header');

      await getCafes();

      event.target.complete();

      placeOffset = 0;
      isInfiniteScrollDisabled.value = false;
    };

    /* Event handlers */
    const loadMoreCafes = async(e) => {
      emit('infiniteScrollToggle');
      placeOffset += 10;
      await getCafes(true);
      emit('infiniteScrollToggle');

      e?.target.complete();
    };

    /* Watchers */
    // Watching for a change on cafeSearchString(search term from search input) prop
    // resetting all the variables for filtered data and loading first 10 records from new filtered data
    watch(cafeSearchString, async() => {
      isInfiniteScrollDisabled.value = false;
      placeOffset = 0;
      getCafes();
      emit('scrollToTop');
    });
    // Watching for a change on sortBy(term for sorting records) prop
    // when new button for sorting is clicked initial 10 cafes are changed to appear correctly
    // (be sorted) on initial view show
    watch(sortBy, async() => {
      if(sortBy.value === 'distance') {
        await checkForLocationPermission();
      }
      await tryGettingLocation();

      isInfiniteScrollDisabled.value = false;
      placeOffset = 0;
      getCafes();
      emit('scrollToTop');
    });
    watch(props.refresher, async() => {
      if(props.refresher.isActive) {
        await refresh(props.refresher.event);
      }
    });

    return {
      /* Component properties */
      cafes,
      isInfiniteScrollDisabled,
      showSkeleton,

      /* Event handlers */
      loadMoreCafes,
      refresh,

      /* Icons */

    };
  },
});
</script>