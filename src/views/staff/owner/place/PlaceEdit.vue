<template>
  <ion-page>
    <ion-content ref="content">
      <TheSegmentNavigation :segments="this.$store.getters['owner/placeSegments']"/>

      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div class="h-full">
        <PlaceEditForm
            :reset-inputs="resetInputs"
            :refresher="refresher"
            @scroll-to-top="scrollToTop(this.$refs.content, 500);"
            @scroll-to-bottom="scrollToBottom(this.$refs.content, 500);"
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

import TheSegmentNavigation from '@/components/TheSegmentNavigation';
import PlaceEditForm        from '@/components/owner/forms/PlaceEditForm';
import { useContent }       from '@/composables/useContent';

export default defineComponent({
  name: "PlaceEdit",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    TheSegmentNavigation,
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
    const { scrollToTop, scrollToBottom } = useContent();

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
      scrollToBottom,
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