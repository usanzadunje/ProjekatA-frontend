<template>
  <ion-page>
    <ion-content ref="content">
      <ion-refresher pull-max="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div class="h-full">
        <PlaceEditForm
            :reset-inputs="resetInputs"
            :refresher="refresher"
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
  IonRefresher,
  IonRefresherContent,
  onIonViewWillLeave,
  onIonViewWillEnter,
}                               from '@ionic/vue';

import PlaceEditForm  from '@/components/owner/forms/PlaceEditForm';
import { useContent } from '@/composables/useContent';

export default defineComponent({
  name: "PlaceEdit",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    PlaceEditForm,
  },
  setup() {
    /* Component properties */
    const resetInputs = ref(false);
    const refresher = ref({
      isActive: false,
      event: null,
    });

    /* Composables */
    const { scrollToTop } = useContent();

    /* Lifecycle hooks */
    onIonViewWillEnter(() => {
      resetInputs.value = false;

    });
    onIonViewWillLeave(() => {
      resetInputs.value = true;
    });
    const refresh = async(event) => {
      refresher.value.isActive = true;
      refresher.value.event = event;
    };


    return {
      /* Component properties */
      resetInputs,
      refresher,

      /* Event handlers */
      refresh,
      scrollToTop,
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