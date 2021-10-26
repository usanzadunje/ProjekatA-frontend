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
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore }             from 'vuex';
import { useI18n }              from 'vue-i18n';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
}                               from '@ionic/vue';

import AccordionList from '@/components/user/AccordionList';
import CategoryIndex from '@/components/owner/CategoryIndex';
import ProductIndex  from '@/components/owner/ProductIndex';

import { useCache }              from '@/composables/useCache';
import { useToastNotifications } from '@/composables/useToastNotifications';

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
    AccordionList,
    CategoryIndex,
    ProductIndex,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const enableInfiniteScroll = ref();

    /* Composables */
    const { getCachedOrFetchPlaceCategories } = useCache();
    const { t } = useI18n();
    const { showErrorToast } = useToastNotifications();

    /* Methods */
    const getMenuData = async(forceFetch = false) => {
      try {
        await getCachedOrFetchPlaceCategories(forceFetch);
        await store.dispatch("owner/getProducts", {});
      }catch(e) {
        showErrorToast(
            null,
            {
              dataFetchingError: t('dataFetchingError'),
            });
      }
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