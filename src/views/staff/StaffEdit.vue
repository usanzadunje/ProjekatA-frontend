<template>
  <ion-page>
    <ion-content ref="content">
      <div class="wrap h-full">
        <EditForm
            :clear-inputs="clearInputs"
            @scrollToTop="scrollToTop(this.$refs.content, 500);"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonPage,
  IonContent,
  onIonViewWillEnter,
  onIonViewWillLeave,
}                               from '@ionic/vue';

import EditForm from '@/components/auth/EditForm';

import { useContent } from '@/composables/useContent';

export default defineComponent({
  name: "StaffEdit",
  components: {
    IonPage,
    IonContent,
    EditForm,
  },
  setup() {
    /* Component properties */
    const clearInputs = ref(false);

    /* Composables */
    const { scrollToTop } = useContent();

    /* Lifecycle hooks */
    onIonViewWillEnter(() => {
      clearInputs.value = false;

    });
    onIonViewWillLeave(() => {
      clearInputs.value = true;
    });

    return {
      /* Component properties */
      clearInputs,

      /* Event handlers */
      scrollToTop,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}
</style>