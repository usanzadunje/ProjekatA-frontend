<template>
  <ion-page>
    <ion-content>
      <TheSegmentNavigation :segments="this.$store.getters['owner/placeSegments']"/>

      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div class="pb-4">
        <div v-show="!showSkeleton">
          <ion-accordion-group>
            <ion-accordion value="categories" class="accordion-list-border-top show-bg">
              <ion-item
                  slot="header"
                  class="show-bg"
                  lines="none"
              >
                <ion-icon
                    :icon="pricetagOutline"
                    class="primary-icon-color"
                ></ion-icon>
                <span class="primary-text-color ml-2">{{ $t('category', 2) }}</span>
              </ion-item>

              <div slot="content" class="px-4">
                <CategoryIndex class="mb-4"/>
              </div>
            </ion-accordion>
            <ion-accordion value="products" class="accordion-list-border-top accordion-list-border-bottom show-bg">
              <ion-item
                  slot="header"
                  class="show-bg"
                  lines="none"
              >
                <ion-icon
                    :icon="fastFoodOutline"
                    :style="`font-size:1.25rem`"
                    class="primary-icon-color"
                ></ion-icon>
                <span class="primary-text-color ml-2">{{ $t('product', 2) }}</span>
              </ion-item>

              <div slot="content" class="px-4">
                <ProductIndex :enable-infinite-scroll="enableInfiniteScroll"/>
              </div>
            </ion-accordion>
          </ion-accordion-group>
        </div>
        <div v-show="showSkeleton" class="px-4">
          <div
              class="py-2.5 flex justify-between accordion-list-box accordion-list-border-bottom accordion-list-border-top">
            <ion-skeleton-text
                animated
                class="w-1/3 h-5"
            ></ion-skeleton-text>
            <ion-skeleton-text
                animated
                class="w-5 h-5 rounded-full"
            ></ion-skeleton-text>
          </div>
          <div class="py-2.5 flex justify-between accordion-list-box accordion-list-border-bottom">
            <ion-skeleton-text
                animated
                class="w-1/3 h-5"
            ></ion-skeleton-text>
            <ion-skeleton-text
                animated
                class="w-5 h-5 rounded-full"
            ></ion-skeleton-text>
          </div>
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
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
}                               from '@ionic/vue';

import TheSegmentNavigation from '@/components/TheSegmentNavigation';
import CategoryIndex        from '@/components/owner/CategoryIndex';
import ProductIndex         from '@/components/owner/ProductIndex';

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
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    TheSegmentNavigation,
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
          {
            errorMessageKey: 'dataFetchingError',
          },
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

ion-icon {
  font-size: 1.25rem;
}

span {
  font-size: 1.125rem !important;
}
</style>