<template>
  <div>
    <ion-infinite-scroll
        @ionInfinite="loadMore($event)"
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
  </div>
</template>

<script>
import { defineComponent, toRef } from 'vue';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
}                                 from '@ionic/vue';

export default defineComponent({
  name: 'InfiniteScroll',
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  props: {
    offset: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    /* Global properties */
    /* Component properties */
    // const isInfiniteScrollDisabled = ref(false);
    const start = toRef(props, 'offset');

    /* Lifecycle hooks */
    /* Methods */
    /* Event handlers */
    const loadMore = async(ev) => {
      start.value += 5;
      // if(!response.data) {
      //   isInfiniteScrollDisabled.value = true;
      //   return;
      // }
      // if(response.data.length < 20) {
      //   isInfiniteScrollDisabled.value = true;
      // }
      ev?.target.complete();
    };

    return {
      /* Component properties */
      /* Event handlers */
      loadMore,
      /* Icons */
    };
  },
});
</script>

<style scoped>

</style>