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
            class="accordion-list-border-top"
            :title="$t('category', 2)"
            :title-size="'1.125rem'"
            :icon-size="'1.25rem'"
            :icon="pricetagOutline"
        >
          <Categories class="mb-4"/>
        </AccordionList>
        <AccordionList
            class="accordion-list-border-top accordion-list-border-bottom"
            :title="$t('product', 2)"
            :title-size="'1.125rem'"
            :icon-size="'1.25rem'"
            :open="true"
            :icon="fastFoodOutline"
        >
          <Products/>
        </AccordionList>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore }        from 'vuex';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
}                          from '@ionic/vue';

import AccordionList from '@/components/user/AccordionList';
import Categories    from '@/components/owner/Categories';
import Products      from '@/components/owner/Products';

import {
  pricetagOutline,
  fastFoodOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "PlaceMenu",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    AccordionList,
    Categories,
    Products,
  },
  setup() {
    /* Component properties */
    const store = useStore();

    /* Methods */
    const getMenuData = async() => {
      await store.dispatch("owner/getCategories");
      await store.dispatch("owner/getProducts");
    };

    /* Lifecycle hooks */
    (async() => {
      await getMenuData();
    })();

    /* Lifecycle hooks */
    const refresh = async(event) => {
      await getMenuData();

      event.target.complete();
    };

    return {
      /* Component properties */

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