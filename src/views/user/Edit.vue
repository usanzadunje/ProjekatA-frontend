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

    <ion-content :fullscreen="true">
      <EditForm/>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
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
}                          from '@ionic/vue';

import EditForm from '@/components/user/EditForm';

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
    /* Lifecycle hooks */
    onIonViewWillEnter(() => {
      settingsTab = document.getElementById('tab-button-settings');
      if(settingsTab) {
        settingsTab.style.color = '#207DFF';
      }
    });
    onIonViewWillLeave(() => {
      if(settingsTab) {
        settingsTab.style.color = '';
      }
    });

    return {
      /* Icons */
      arrowBackOutline,
      chevronBackOutline,
    };
  },
});
</script>
<style scoped>
ion-toolbar {
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