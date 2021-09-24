<template>
  <ion-page>
    <div class="pt-6 px-14">
      <ion-segment value="owner.place.info" @ionChange="pageChange($event)" class="bg-gray-100" mode="ios">
        <ion-segment-button value="owner.place.info" layout="icon-top" mode="ios">
          <ion-label>{{ $t('basic') }}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="owner.place.tables" layout="icon-top" mode="ios">
          <ion-label>{{ $t('tables') }}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="owner.place.menu" layout="icon-top" mode="ios">
          <ion-label>{{ $t('menu') }}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
    <ion-router-outlet class="mt-20">

    </ion-router-outlet>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonPage,
  IonRouterOutlet,
  IonSegment,
  IonSegmentButton,
  IonLabel,
}                          from '@ionic/vue';

import {
  heart,
}                    from 'ionicons/icons';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'OwnerPlaceLayout',
  components: {
    IonPage,
    IonRouterOutlet,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  },
  setup() {
    /* Global properties */
    const router = useRouter();
    /* Component properties */

    /* Composables */


    /* Lifecycle hooks */


    /* Event handlers */
    const pageChange = (e) => {
      router.push({ name: e.target.value });
    };
    return {
      /* Component properties */

      /* Event handlers */
      pageChange,

      /* Icons from */
      heart,
    };
  },
});
</script>
<style scoped>
div {
  background: var(--show-paint);
}
</style>