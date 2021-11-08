<template>
  <ion-page>
    <ion-header :translucent="true" class="ion-no-border">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button
              mode="ios"
              defaultHref="/dashboard"
              :text="$t('back')"
          >
          </ion-back-button>
        </ion-buttons>
        <ion-title mode="ios">{{ $t('profile') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="content">
      <div class="px-4 pt-4 h-full">
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
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonTitle,
  IonBackButton,
  onIonViewWillEnter,
  onIonViewWillLeave,
}                               from '@ionic/vue';

import EditForm from '@/components/auth/EditForm';

import { useContent } from '@/composables/useContent';

import { arrowBackOutline, chevronBackOutline } from 'ionicons/icons';

export default defineComponent({
  name: "UserEdit",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButtons,
    IonTitle,
    IonBackButton,
    EditForm,
  },
  setup() {
    /* Component properties */
    let settingsTab = null;
    const clearInputs = ref(false);

    /* Composables */
    const { scrollToTop } = useContent();

    /* Lifecycle hooks */
    onIonViewWillEnter(() => {
      clearInputs.value = false;
      settingsTab = document.getElementById('tab-button-settings');
      if(settingsTab) {
        settingsTab.style.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--user-selected-color');
      }
    });
    onIonViewWillLeave(() => {
      clearInputs.value = true;
      if(settingsTab) {
        settingsTab.style.color = '';
      }
    });

    return {
      /* Component properties */
      clearInputs,

      /* Event handlers */
      scrollToTop,

      /* Icons */
      arrowBackOutline,
      chevronBackOutline,
    };
  },
});
</script>
<style scoped>
ion-header {
  border-bottom: solid 1px var(--horizontal-divider);
}

ion-toolbar {
  --background: var(--show-paint);
  border-bottom-left-radius: unset !important;
  border-bottom-right-radius: unset !important;
}

ion-back-button::part(icon) {
  font-size: 1.625rem;
}

ion-content {
  --background: var(--show-paint);
}

ion-title {
  --color: var(--primary-heading)
}

</style>