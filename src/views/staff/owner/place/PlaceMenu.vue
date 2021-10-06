<template>
  <ion-page>
    <ion-content>
      <div class="px-4 pb-4">
        <Categories/>
        <Products/>
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
  onIonViewWillLeave,
}                          from '@ionic/vue';

import Categories from '@/components/owner/Categories';
import Products   from '@/components/owner/Products';

export default defineComponent({
  name: "PlaceMenu",
  components: {
    IonPage,
    IonContent,
    Categories,
    Products,
  },
  setup() {
    /* Component properties */
    const store = useStore();

    /* Lifecycle hooks */
    (async() => {
      await store.dispatch("owner/getCategories");
      await store.dispatch("owner/getProducts");
    })();
    onIonViewWillLeave(() => {
    });

    return {
      /* Component properties */

      /* Event handlers */
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