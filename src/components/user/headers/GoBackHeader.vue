<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <div class="flex justify-between mt-1 md margin-top-reset">
        <ion-buttons slot="start">
          <ion-button
              :routerLink="`${$route.query.redirect || '/home'}`">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-buttons>

        <NotificationsPreview/>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
}                          from '@ionic/vue';

import NotificationsPreview from '@/components/user/NotificationsPreview';

import {
  arrowBackOutline,
}
  from 'ionicons/icons';

export default defineComponent({
  name: 'GoBackHeader',
  components: {
    IonHeader,
    IonToolbar,
    IonButtons,
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

</style>
