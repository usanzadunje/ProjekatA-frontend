<template>
  <ion-page>
    <ion-content>
      <ion-item class="no-border mt-3">
        <h1 class="settings-heading">Podesavanja</h1>
      </ion-item>
      <ion-item class="no-border">
        <div class="settings-icon-badge settings-red-icon-color flex justify-center settings-padding-icon-top">
          <ion-icon :icon="flash" class="text-white"></ion-icon>
        </div>
        <p class="uppercase settings-fade-text ml-2">Globalna podesavanja</p>
      </ion-item>
      <div>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Dark mode</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pull-right">
            <ion-label class="settings-fade-text">{{ isDarkModeOn ? 'ON' : 'OFF' }}</ion-label>
            <ion-toggle
                id="dark-mode-toggle"
                @ionChange="toggleDarkMode($event)"
            ></ion-toggle>
          </ion-item>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Privatnost</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Notifikacije</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pull-right">
            <ion-label class="settings-fade-text">{{ areNotificationsOn ? 'ON' : 'OFF' }}</ion-label>
            <ion-toggle
                id="notification-toggle"
                @ionChange="toggleNotifications($event)"
            ></ion-toggle>
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
            <ion-icon :icon="rocket" class="text-white"></ion-icon>
          </div>
          <p class="uppercase settings-fade-text ml-2">O aplikaciji</p>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Podrzite autore</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Web sajt</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-button class="uppercase" fill="clear" expand="block" @click="logout">
          Logout
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { useStore } from 'vuex';

import {
  IonContent,
  IonPage,
  IonItem,
  IonIcon,
  IonLabel,
  IonToggle,
  IonButton,
} from '@ionic/vue';

import {
  flash,
  chevronForward,
  rocket,
} from 'ionicons/icons';

import AuthService    from '@/services/AuthService';
import { useStorage } from '@/services/StorageService';

import { useFCM } from '@/composables/useFCM';

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
    /* Global properties */
    const store = useStore();

    /* Component properties */
    let isDarkModeOn = ref(false);
    let areNotificationsOn = ref(false);
    let language = ref('SRB');

    const { set, get } = useStorage();

    /* Lifecycle hooks */
    //Setting toggle checked attribute to whatever user choose and is persisted in storage
    //for notifications
    get(`areNotificationsOn.${store.getters['auth/authUser'].id}`)
        .then((response) => {
          areNotificationsOn.value = !!response;
          document.getElementById('notification-toggle').checked = areNotificationsOn.value;
        })
        .catch((error) => {
          alert(error);
        });
    get(`isDarkModeOn.${store.getters['auth/authUser'].id}`)
        .then((response) => {
          isDarkModeOn.value = !!response;
          document.getElementById('dark-mode-toggle').checked = isDarkModeOn.value;
        })
        .catch((error) => {
          alert(error);
        });

    /* Event handlers */
    const toggleDarkMode = (e) => {
      if(!e.target.checked) {
        set(`isDarkModeOn.${store.getters['auth/authUser'].id}`, false);
      }else {
        //Remembering user decision for future usage
        set(`isDarkModeOn.${store.getters['auth/authUser'].id}`, true);
      }
      document.body.classList.toggle('dark', e.target.checked);
      isDarkModeOn.value = e.target.checked;
    };
    const toggleNotifications = (e) => {
      if(!e.target.checked) {
        /* Remove FCM token thus disabling notifications */
        AuthService.removeFcmToken()
                   .then((response) => {
                     if(response.data) {
                       //Remembering user decision for future usage
                       set(`areNotificationsOn.${store.getters['auth/authUser'].id}`, false);
                     }
                   })
                   .catch((error) => {
                     alert(error);
                   });

      }else {
        const { initPush } = useFCM(store.getters['auth/authUser'].id);
        //Remembering user decision for future usage
        set(`areNotificationsOn.${store.getters['auth/authUser'].id}`, true);
        initPush();
      }
      areNotificationsOn.value = e.target.checked;
    };
    const logout = async() => {
      await store.dispatch("auth/logout");
    };

    return {
      /* Compunent properties */
      isDarkModeOn,
      areNotificationsOn,
      language,

      /* Event handlers */
      toggleDarkMode,
      toggleNotifications,
      logout,

      /* Icons from */
      flash,
      chevronForward,
      rocket,
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