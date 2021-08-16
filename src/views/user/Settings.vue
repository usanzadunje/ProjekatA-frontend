const<template>
  <ion-page>
    <ion-content>
      <ion-item class="no-border mt-3">
        <h1 class="settings-heading">{{ $t('settings') }}</h1>
      </ion-item>
      <ion-item class="no-border">
        <div class="settings-icon-badge settings-red-icon-color flex justify-center settings-padding-icon-top">
          <ion-icon :icon="flash" class="text-white"></ion-icon>
        </div>
        <p class="uppercase settings-fade-text ml-2">{{ $t('global') }} {{ $t('settings') }}</p>
      </ion-item>
      <div>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">Dark mode</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pull-right">
            <ion-label class="settings-fade-text">{{ isDarkModeOn ? 'ON' : 'OFF' }}</ion-label>
            <ion-toggle
                :checked="isDarkModeOn"
                @ionChange="toggleDarkMode($event)"
                mode="md"
            ></ion-toggle>
          </ion-item>
        </ion-item>
        <ion-item class="ion-item-padding-right" @click="showPrivacy">
          <p class="settings-item-text">{{ $t('privacy') }}</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item class="ion-item-padding-right" routerLink="/edit">
          <p class="settings-item-text">{{ $t('profile') }}</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">{{ $t('notifications') }}</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pull-right">
            <ion-label class="settings-fade-text">{{ areNotificationsOn ? 'ON' : 'OFF' }}</ion-label>
            <ion-toggle
                :checked="areNotificationsOn"
                @ionChange="toggleNotifications($event)"
                mode="md"
            ></ion-toggle>
          </ion-item>
        </ion-item>
        <ion-item class="ion-item-padding-right" @click="chooseLanguage">
          <p class="settings-item-text">{{ $t('language') }}</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border mr-1">
            <ion-button fill="clear" class="settings-fade-text">
              {{ language || 'SRB' }}
            </ion-button>
          </ion-item>
        </ion-item>
      </div>
      <div class="mt-5">
        <ion-item class="flex justify-start no-border">
          <div class="settings-icon-badge settings-yellow-icon-color flex justify-center settings-padding-icon-top">
            <ion-icon :icon="rocket" class="text-white"></ion-icon>
          </div>
          <p class="uppercase settings-fade-text ml-2">{{ $t('about') }}</p>
        </ion-item>
        <ion-item class="ion-item-padding-right" @click="showSupportAuthors">
          <p class="settings-item-text">{{ $t('support') }}</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item class="ion-item-padding-right" @click="redirectToWebsite">
          <p class="settings-item-text">{{ $t('site') }}</p>
          <ion-button fill="clear" slot="end" href="//projekata.com">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-button class="mt-5 uppercase logout-button" fill="clear" expand="block" @click="logout">
          Logout
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore }             from 'vuex';
import { useI18n }              from 'vue-i18n';
import { getLanguages }         from '@/lang';
import {
  IonContent,
  IonPage,
  IonItem,
  IonIcon,
  IonLabel,
  IonToggle,
  IonButton,
  pickerController,
  onIonViewWillEnter, loadingController,
}                               from '@ionic/vue';

import AuthService from '@/services/AuthService';

import { StorageService }            from '@/services/StorageService';
import { useFCM }                from '@/composables/useFCM';
import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  flash,
  chevronForward,
  rocket,
}                                  from 'ionicons/icons';
import { Keyboard, KeyboardStyle } from '@capacitor/keyboard';

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
    const isDarkModeOn = ref(false);
    const areNotificationsOn = ref(false);
    const language = ref('SRB');

    /* Methods */
    const { set, get } = StorageService();
    const { t, locale } = useI18n({ useScope: 'global' });
    const { initPush } = useFCM();
    const { showErrorToast } = useToastNotifications();


    /* Lifecycle hooks */
    //Setting toggle checked attribute to whatever user choose and is persisted in storage
    //for notifications
    onIonViewWillEnter(async() => {
      try {
        areNotificationsOn.value = !!await get(`areNotificationsOn.${store.getters['auth/authUser'].id}`);
        isDarkModeOn.value = !!await get(`isDarkModeOn.${store.getters['auth/authUser'].id}`);
        const storedLang = await get(`localization.${store.getters['auth/authUser'].id}`) || {
          text: 'SRB',
          value: 'sr',
        };
        language.value = storedLang.text;
      }catch(e) {
        areNotificationsOn.value = false;
        isDarkModeOn.value = false;
        language.value = 'SRB';
      }
    });

    /* Event handlers */
    const toggleDarkMode = async(e) => {
      if(!e.target.checked) {
        await set(`isDarkModeOn.${store.getters['auth/authUser'].id}`, false);

        Keyboard.setStyle({
          style: KeyboardStyle.Light,
        });

      }else {
        await set(`isDarkModeOn.${store.getters['auth/authUser'].id}`, true);

        Keyboard.setStyle({
          style: KeyboardStyle.Dark,
        });
      }
      isDarkModeOn.value = e.target.checked;
      document.body.classList.toggle('dark', e.target.checked);
    };
    const toggleNotifications = async(e) => {
      if(!e.target.checked) {
        /* Remove FCM token thus disabling notifications */
        try {
          const response = await AuthService.removeFcmToken();
          if(response && response.data) {
            set(`areNotificationsOn.${store.getters['auth/authUser'].id}`, false);
          }
        }catch(error) {
          showErrorToast(
              null,
              {
                pushNotificationPermission: t('generalAlertError'),
              });
        }
      }else {
        set(`areNotificationsOn.${store.getters['auth/authUser'].id}`, true);
        const noPermission = await initPush();
        if(noPermission) {
          e.target.disabled = true;
          e.target.checked = false;
        }
      }
      areNotificationsOn.value = e.target.checked;
    };
    const logout = async() => {
      let loading = null;
      try {
        loading = await loadingController
            .create({
              spinner: 'crescent',
              cssClass: 'custom-loading',
              message: t('loggingOut'),
              mode: 'ios',
            });
        await loading.present();
        await store.dispatch("auth/logout");
      }catch(error) {
        showErrorToast(
            null,
            {
              generalError: t('generalAlertError'),
            });
      }finally {
        loading?.dismiss();
      }
    };
    const chooseLanguage = async() => {
      const picker = await pickerController.create({
        columns: [
          {
            name: 'language',
            options: getLanguages(language.value),
          },
        ],
        buttons: [
          {
            text: t('cancel'),
            role: "cancel",
          },
          {
            text: t('confirm'),
            role: "confirm",
            handler: (value) => {
              // Direktno se menja locale u i18n
              locale.value = value.language.value;
              language.value = value.language.text;
              picker.dismiss(value.language, "confirm");
            },
          },
        ],
      });
      picker.onDidDismiss().then((value) => {
        //Sacuvas izbor korisnika u storage
        const localization = value.data;
        set(`localization.${store.getters['auth/authUser'].id}`, localization);
      });
      await picker.present();
    };
    const showPrivacy = () => {
      alert('Privacy');
    };
    const showSupportAuthors = () => {
      alert('Support authors');
    };
    const redirectToWebsite = () => {
      alert('Redirect to website');
    };

    return {
      /* Component properties */
      isDarkModeOn,
      areNotificationsOn,
      language,

      /* Event handlers */
      toggleDarkMode,
      toggleNotifications,
      logout,
      chooseLanguage,
      showPrivacy,
      showSupportAuthors,
      redirectToWebsite,

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
  --background: var(--primary-paint);
  --border-color: rgba(112, 112, 112, 0.1);
  --inner-padding-end: 0;
}

.ion-item-padding-right {
  --padding-end: 20px;
}
</style>