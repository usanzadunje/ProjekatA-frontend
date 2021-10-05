<template>
  <ion-page>
    <ion-content>
      <div class="px-4 pb-4">
        <MenuForm/>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonPage,
  IonContent,
  onIonViewWillLeave,
}                          from '@ionic/vue';

import MenuForm from '@/components/owner/forms/MenuForm';

export default defineComponent({
  name: "PlaceMenu",
  components: {
    IonPage,
    IonContent,
    MenuForm,
  },
  setup() {
    /* Component properties */

    /* Lifecycle hooks */
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