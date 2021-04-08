<template>
  <ion-list>
    <ion-item v-for="cafe in filteredCafes" :key="cafe.id">
      <ion-label>{{ cafe.name }}</ion-label>
    </ion-item>
  </ion-list>
  <ion-infinite-scroll
      @ionInfinite="loadData($event)"
      threshold="100px"
      id="infinite-scroll"
  >
    <ion-infinite-scroll-content
        class="mt-2"
        loading-spinner="bubbles"
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
}                               from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import CafeService              from '@/services/CafeService';

export default defineComponent({
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonLabel,
    IonList,
  },
  setup() {
    /* Properties */
    let cafes = ref([]);
    let filteredCafes = ref([]);
    let cafeCount = 0;

    //*Before mounting in setup fetching all cafes
    CafeService.index().then((response) => cafes.value = response.data).catch((error) => alert(error));

    /* Methods */
    //Grabbing 20 more cafes that match required filter
    const loadMoreCafes = () => {
      cafeCount = cafeCount + 20;
      filteredCafes.value = filteredCafes.value.concat(cafes.value.slice(cafeCount - 20, cafeCount));
    };

    //Loading 20 cafes to show initially
    setTimeout(() => {
      loadMoreCafes();
    }, 500);

    const loadData = (ev) => {
      setTimeout(() => {
        loadMoreCafes();
        ev.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if(cafes.value.length <= cafeCount) {
          ev.target.disabled = true;
        }
      }, 500);
    };


    return {
      /* Properties */
      cafes,
      filteredCafes,

      /* Methods */
      loadMoreCafes,
      loadData,

    };
  },
});
</script>