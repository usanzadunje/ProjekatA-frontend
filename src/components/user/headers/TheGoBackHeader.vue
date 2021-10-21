<template>
  <div id="goHeader">
    <div class="flex justify-between mt-1 md margin-top-reset">
      <ion-button fill="clear" :routerLink="$route.query.redirect || '/home'" class="h-auto">
        <ion-icon
            :icon="arrowBackOutline"
            class="text-gray-400"
        ></ion-icon>
      </ion-button>

      <NotificationsPreview/>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonButton,
  IonIcon,
}                          from '@ionic/vue';

import NotificationsPreview from '@/components/user/NotificationsPreview';

import {
  arrowBackOutline,
}
  from 'ionicons/icons';

export default defineComponent({
  name: 'TheGoBackHeader',
  components: {
    IonButton,
    IonIcon,
    NotificationsPreview,
  },
  setup() {
    /* Component properties */

    /* Event handlers */

    return {
      /* Component properties */

      /* Event handlers */

      /* Icons */
      arrowBackOutline,
    };
  },
});
</script>
<style scoped>
ion-icon {
  font-size: 1.75rem !important;
}

ion-button {
  --padding-start: 0 !important;
  --padding-end: 5px !important;
}
</style>
