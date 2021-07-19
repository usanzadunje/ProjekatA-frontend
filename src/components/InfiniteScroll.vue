<template>
  <div>
    <FilterCategoryHeading :title="$t('searchResults')" class="mb-2"/>
    <div v-if="!showSkeleton">
      <div v-for="cafe in cafes" :key="cafe.id" class="mb-5">
        <CafeCard
            :cafe="cafe"
            @click="openCafeModal(cafe.id)"
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
        loading-spinner="lines"
        :loading-text="$t('refresherText')">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</template>

<script>
import { defineComponent, ref, watch, toRefs } from 'vue';

import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/vue';

import CafeService from '@/services/CafeService';

import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import CafeCard              from '@/components/user/CafeCard';
import SkeletonCafeCard              from '@/components/user/SkeletonCafeCard';

export default defineComponent({
  name: "InfiniteScroll",
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
  },
  emits: ['scrollToTop', 'openCafeModal'],
  setup(props, { emit }) {
    /* Component properties */
    // All non filtered cafes
    let cafes = ref([]);
    // Initial 20 cafes that are shown when no filters are applied
    let initial20Cafes = null;
    // Search term for filtering records
    let { cafeSearchString } = toRefs(props);
    // Term for sorting records in specific order
    let { sortBy } = toRefs(props);
    // From which number on to take cafe records
    let cafeStart = 0;
    // Property to enable / disable loading infinite scroll animation and action
    let isInfiniteScrollDisabled = ref(false);
    let showSkeleton = ref(true);

    /* Lifecycle hooks */
    //*Before mounting fetching initial 20 cafes to show
    CafeService.getCafeCardsChunkInfo(cafeStart, 20, cafeSearchString.value, sortBy.value)
               .then((response) => {
                 cafes.value = response.data;
                 showSkeleton.value = false;
                 initial20Cafes = response.data;
               })
               .catch((error) => alert(JSON.stringify(error)));

    /* Methods */
    // Grabbing 20 more cafes that match required filter
    const loadMoreCafes = () => {
      cafeStart += 20;
      CafeService.getCafeCardsChunkInfo(cafeStart, 20, cafeSearchString.value, sortBy.value)
                 .then((response) => {
                   // There are no more records
                   if(!response.data) return;
                   if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                   cafes.value = cafes.value.concat(response.data);
                 })
                 .catch((error) => alert(JSON.stringify(error)));

    };
    const filterCafes = (ignoreIfNoSearchTerm = false) => {
      //If there is no search term all cafes are returned
      if(!cafeSearchString.value && !ignoreIfNoSearchTerm) {
        return cafes.value = initial20Cafes;
      }

      CafeService.getCafeCardsChunkInfo(cafeStart, 20, cafeSearchString.value, sortBy.value)
                 .then((response) => {
                   if(!response.data) return;
                   if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                   cafes.value = response.data;
                 })
                 .catch((error) => alert(JSON.stringify(error)));

    };

    /* Event handlers */
    const loadData = (ev) => {
      setTimeout(() => {
        loadMoreCafes();
        ev.target.complete();
      }, 300);
    };

    const openCafeModal = (cafeId) => {
      CafeService.show(cafeId)
                 .then((response) => {
                   emit('openCafeModal', response.data);
                 });
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
    watch(sortBy, () => {
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
      openCafeModal,

      /* Methods */
      loadMoreCafes,
      loadData,

      /* Icons */

    };
  },
});
</script>