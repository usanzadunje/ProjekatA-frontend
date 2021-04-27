<template>
  <ion-page>
    <ion-content>
      <ion-item class="no-border mt-3">
        <h1 class="settings-heading">Podesavanja</h1>
      </ion-item>
      <ion-item class="no-border">
        <div class="settings-icon-badge settings-red-icon-color flex justify-center settings-padding-icon-top">
          <ion-icon :icon="flashFilled"></ion-icon>
        </div>
        <p class="uppercase settings-fade-text ml-2">Globalna podesavanja</p>
      </ion-item>
      <div>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Dark mode</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pull-right">
            <ion-label class="settings-fade-text">{{ isDarkModeOn ? 'ON' : 'OFF' }}</ion-label>
            <ion-toggle @ionChange="toggleDarkMode($event)"></ion-toggle>
          </ion-item>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Privatnost</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="arrowRightOutline"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Notifikacije</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pull-right">
            <ion-label class="settings-fade-text">{{ areNotificationsOn ? 'ON' : 'OFF' }}</ion-label>
            <ion-toggle @ionChange="toggleNotifications($event)"></ion-toggle>
          </ion-item>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Jezik</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border mr-1">
            <ion-button fill="clear" class="settings-fade-text">{{ language ?? 'SRB' }}</ion-button>
          </ion-item>
        </ion-item>
      </div>
      <div class="mt-5">
        <ion-item class="flex justify-start no-border">
          <div class="settings-icon-badge settings-yellow-icon-color flex justify-center settings-padding-icon-top">
            <ion-icon :icon="rocketFilled"></ion-icon>
          </div>
          <p class="uppercase settings-fade-text ml-2">O aplikaciji</p>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Podrzite autore</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="arrowRightOutline"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Web sajt</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="arrowRightOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonContent,
  IonPage,
  IonItem,
  IonIcon,
  IonLabel,
  IonToggle,
  IonButton,
}                               from '@ionic/vue';

import {
  flashFilled,
  arrowRightOutline,
  rocketFilled,
}                  from '@/assets/icons';
import AuthService from '@/services/AuthService';

export default defineComponent({
  name: 'Settings',
  components: {
    IonContent,
    IonPage,
    IonItem,
    IonIcon,
    IonLabel,
    IonToggle,
    IonButton,
  },
  setup() {
    /* Properties */
    let isDarkModeOn = ref(false);
    let areNotificationsOn = ref(false);
    let language = ref('SRB');

    /* Event handlers */
    const toggleDarkMode = (e) => {
      isDarkModeOn.value = e.target.checked;
    };

    const toggleNotifications = (e) => {
      if(!e.target.checked) {
        /* Remove FCM token thus disabling notifications */
        AuthService.removeFcmToken()
                   .then()
                   .catch((error) => {
                     alert(error);
                   });
      }
      areNotificationsOn.value = e.target.checked;
    };

    return {
      /* Properties */
      isDarkModeOn,
      areNotificationsOn,
      language,

      /* Event handlers */
      toggleDarkMode,
      toggleNotifications,

      /* Icons */
      flashFilled,
      arrowRightOutline,
      rocketFilled,
    };
  },
});
</script>
<style scoped>
ion-item {
  --background: #F6F7FB;
  --border-color: rgba(112, 112, 112, 0.1);
  --inner-padding-end: 0;
}

.ion-item-padding-right {
  --padding-end: 20px;
}
</style>