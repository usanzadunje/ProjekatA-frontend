<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar mode="ios">
        <ion-buttons slot="start">
          <ion-back-button
              mode="ios"
              defaultHref="/dashboard"
              :text="$t('back')"
              :icon="chevronBackOutline">
            >
          </ion-back-button>
        </ion-buttons>
        <ion-title mode="ios">{{ $t('updateProfile') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="px-4 pt-4">
        <EditForm :clear-inputs="clearInputs"/>
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

import { arrowBackOutline, chevronBackOutline } from 'ionicons/icons';

export default defineComponent({
  name: "Edit",
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

    /* Lifecycle hooks */
    onIonViewWillEnter(() => {
      clearInputs.value = false;
      settingsTab = document.getElementById('tab-button-settings');
      if(settingsTab) {
        settingsTab.style.color = '#207DFF';
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
      /* Icons */
      arrowBackOutline,
      chevronBackOutline,
    };
  },
});
</script>
<style scoped>
ion-toolbar {
  --border-color: var(--header-border-color);
  --background: var(--show-paint);
  border-bottom-left-radius: unset !important;
  border-bottom-right-radius: unset !important;
}

ion-content {
  --background: var(--show-paint);
}

ion-title {
  --color: var(--primary-heading)
}

</style>