<template>
  <ion-page>
    <ion-content>
      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div class="px-4 pb-4">
        <div v-show="!showSkeleton">
          <AccordionList
              :panel-id="'categoryPanel'"
              :title="$t('category', 2)"
              :title-size="'1.125rem'"
              :icon-size="'1.25rem'"
              :icon="pricetagOutline"
              class="accordion-list-border-top"
          >
            <CategoryIndex class="mb-4"/>
          </AccordionList>
          <AccordionList
              :panel-id="'productPanel'"
              :title="$t('product', 2)"
              :title-size="'1.125rem'"
              :icon-size="'1.25rem'"
              :open="true"
              :icon="fastFoodOutline"
              class="accordion-list-border-top accordion-list-border-bottom"
          >
            <ProductIndex :enable-infinite-scroll="enableInfiniteScroll"/>
          </AccordionList>
        </div>
        <div>
          <ion-skeleton-text
              v-show="showSkeleton"
              animated="true"
              class="w-ful h-12 mb-0.5"
          ></ion-skeleton-text>
          <ion-skeleton-text
              v-show="showSkeleton"
              animated="true"
              class="w-ful h-12"
          ></ion-skeleton-text>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore }             from 'vuex';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
}                               from '@ionic/vue';

import AccordionList from '@/components/user/AccordionList';
import CategoryIndex from '@/components/owner/CategoryIndex';
import ProductIndex  from '@/components/owner/ProductIndex';

import { useCache }         from '@/composables/useCache';
import { useErrorHandling } from '@/composables/useErrorHandling';

import {
  pricetagOutline,
  fastFoodOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "MenuIndex",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    AccordionList,
    CategoryIndex,
    ProductIndex,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const enableInfiniteScroll = ref();
    const showSkeleton = ref(true);

    /* Composables */
    const { getCachedOrFetchPlaceCategories } = useCache();
    const { tryCatch } = useErrorHandling();

    /* Methods */
    const getMenuData = async(forceFetch = false) => {
      showSkeleton.value = true;

      await tryCatch(
          async() => {
            await getCachedOrFetchPlaceCategories(forceFetch);
            await store.dispatch("owner/getProducts", {});
          },
          null,
          'dataFetchingError',
      );

      showSkeleton.value = false;
    };

    /* Lifecycle hooks */
    (async() => {
      await getMenuData();
    })();

    /* Lifecycle hooks */
    const refresh = async(event) => {
      enableInfiniteScroll.value = true;

      await getMenuData(true);

      event.target.complete();

      enableInfiniteScroll.value = false;
    };

    return {
      /* Component properties */
      enableInfiniteScroll,
      showSkeleton,

      /* Event handlers */
      refresh,

      /* Icons */
      pricetagOutline,
      fastFoodOutline,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
  background: var(--show-paint);
}
</style>