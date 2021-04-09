<template>
  <FilterCategoryHeading class="mb-3"/>
  <ion-list>
    <ion-item v-for="cafe in cafes" :key="cafe.id">
      <ion-label>{{ cafe.name }}</ion-label>
    </ion-item>
  </ion-list>
  <ion-infinite-scroll
      @ionInfinite="loadData($event)"
      threshold="100px"
      id="infinite-scroll"
      :disabled="isInfiniteScrollDisabled"
  >
    <ion-infinite-scroll-content
        class="mt-6"
        loading-spinner="lines"
        loading-text="Ucitavanje rezultata...">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</template>

<script>
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
}                                              from '@ionic/vue';
import { defineComponent, ref, watch, toRefs } from 'vue';
import CafeService                             from '@/services/CafeService';
import FilterCategoryHeading                   from '@/components/user/FilterCategoryHeading';

export default defineComponent({
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonLabel,
    IonList,
    FilterCategoryHeading,
  },
  props: {
    cafeSearchString: {
      type: String,
      default: null,
    },
  },
  emits: ["scrollToTop"],
  setup(props, { emit }) {
    /* Properties */
    // All non filtered cafes
    let cafes = ref([]);
    // All cafes that match search string
    let initial20Cafes = null;
    // Chunks from filtered cafes that are shown piece by piece through infinite scroll component
    let filteredCafesChunks = ref([]);
    let { cafeSearchString } = toRefs(props);
    let cafeStart = 0;
    // Property to enable / disable loading infinite scroll animation and action
    let isInfiniteScrollDisabled = ref(false);

    //*Before mounting fetching initial 20 cafes to show
    CafeService.getCafeCardsChunkInfo(cafeStart, 20)
               .then((response) => {
                 cafes.value = response.data;
                 initial20Cafes = response.data
               })
               .catch((error) => alert(error));

    /* Methods */
    // Grabbing 20 more cafes that match required filter
    const loadMoreCafes = () => {
      cafeStart += 20;
      CafeService.getCafeCardsChunkInfo(cafeStart, 20)
                 .then((response) => cafes.value.concat(response.data))
                 .catch((error) => alert(error));

    };

    const filterCafes = (searchTerm) => {
      //If there is no search term all cafes are returned
      if(!searchTerm) {
        return cafes.value = initial20Cafes;
      }

      return cafes.value.filter(function(cafe) {
        if(cafe.name.toLowerCase().indexOf(searchTerm.trim().toLowerCase()) !== -1) {
          return cafe;
        }
      });
    };

    const loadData = (ev) => {
      setTimeout(() => {
        loadMoreCafes();
        ev.target.complete();

        // // App logic to determine if all data is loaded and disable the infinite scroll
        // if(allFilteredCafes.value.length <= cafeCount) {
        //   isInfiniteScrollDisabled.value = true;
        // }
      }, 600);
    };

    /* Watchers */
    // Watching for a change on cafeSearchString(search term from search input) prop
    // resetting all the variables for filtered data and loading first 20 records from new filtered data
    watch(cafeSearchString, () => {
      isInfiniteScrollDisabled.value = false;
      cafeStart = 0;
      filteredCafesChunks.value = [];
      cafes.value = filterCafes(cafeSearchString.value);
      loadMoreCafes();
      emit('scrollToTop');
    });


    return {
      /* Properties */
      cafes,
      filteredCafesChunks,
      isInfiniteScrollDisabled,

      /* Computed properties */

      /* Methods */
      loadMoreCafes,
      loadData,

    };
  },
});
</script>