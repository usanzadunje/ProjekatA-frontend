<template>
  <ion-page>
    <div class="pt-6 px-8">
      <ion-segment :value="$route.name" @ionChange="pageChange($event)" class="bg-gray-100" mode="ios">
        <ion-segment-button value="owner.place.info" mode="ios">
          <ion-label>{{ $t('basic') }}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="owner.place.tables" mode="ios">
          <ion-label>{{ $t('tables') }}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="owner.place.menu" mode="ios">
          <ion-label>{{ $t('menu') }}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
    <ion-router-outlet
        ref="ownerPlaceRouterOutlet"
        class="mt-20"
    >
    </ion-router-outlet>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonPage,
  IonRouterOutlet,
  IonSegment,
  IonSegmentButton,
  IonLabel,
}                               from '@ionic/vue';

import {
  heart,
}                    from 'ionicons/icons';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'OwnerLayout',
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
    const ownerPlaceRouterOutlet = ref();
    /* Composables */

    /* Lifecycle hooks */
    window.addEventListener('load', () => {
      ownerPlaceRouterOutlet.value.$el.swipeHandler = null;
    });
    /* Event handlers */
    const pageChange = (e) => {
      router.push({ name: e.target.value });
    };
    return {
      /* Component properties */
      ownerPlaceRouterOutlet,

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