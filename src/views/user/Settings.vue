const
<template>
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
                :disabled="isDarkModeDisabled"
                :checked="isDarkModeOn"
                @click="toggleDarkMode($event)"
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
                :disabled="areNotificationsDisabled"
                :checked="areNotificationsOn"
                @click="toggleNotifications($event)"
                mode="md"
            ></ion-toggle>
          </ion-item>
        </ion-item>
        <ion-item class="ion-item-padding-right" @click="chooseLanguage">
          <p class="settings-item-text">{{ $t('language') }}</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border mr-1">
            <ion-button fill="clear" class="settings-fade-text">
              {{ localization.text || 'SRB' }}
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
        <ion-button
            class="mt-5 uppercase logout-button"
            fill="clear"
            expand="block"
            @click="this.$store.dispatch('auth/logout');
        ">
          {{ $t('logout') }}
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, ref }                                                          from 'vue';
import { useStore }                                                                                from 'vuex';
import { useI18n }                                                                                 from 'vue-i18n';
import { getLanguages }                                                                            from '@/lang';
import { IonButton, IonContent, IonIcon, IonItem, IonLabel, IonPage, IonToggle, pickerController } from '@ionic/vue';

import AuthService from '@/services/AuthService';

import { useFCM }                from '@/composables/useFCM';
import { useToastNotifications } from '@/composables/useToastNotifications';

import { chevronForward, flash, rocket } from 'ionicons/icons';
import { Keyboard, KeyboardStyle }       from '@capacitor/keyboard';
import { Capacitor }                     from '@capacitor/core';

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
    const isDarkModeOn = computed(() => store.getters['user/darkMode']);
    const areNotificationsOn = computed(() => store.getters['user/notifications']);
    const localization = computed(() => store.getters['user/localization']);
    const isDarkModeDisabled = ref(false);
    const areNotificationsDisabled = ref(false);

    if(Capacitor.getPlatform() === 'web') {
      areNotificationsDisabled.value = true;
    }

    /* Methods */
    const { t, locale } = useI18n({ useScope: 'global' });
    const { registerToken } = useFCM();
    const { showErrorToast } = useToastNotifications();

    /* Event handlers */
    const toggleDarkMode = async(e) => {
      isDarkModeDisabled.value = true;
      try {
        if(e.target.checked) {
          await store.dispatch('user/setDarkMode', false);

          Keyboard?.setStyle({
            style: KeyboardStyle.Light,
          });
        }else {
          await store.dispatch('user/setDarkMode', true);

          Keyboard?.setStyle({
            style: KeyboardStyle.Dark,
          });
        }
      }catch(error) {
        showErrorToast(error);
      }finally {
        document.body.classList.toggle('dark', e.target.checked);
        isDarkModeDisabled.value = false;
      }
    };
    const toggleNotifications = async(e) => {
      try {
        if(e.target.checked) {
          /* Remove FCM token thus disabling notifications */
          await store.dispatch('user/setNotifications', false);
          await AuthService.removeFcmToken();
        }else {
          await store.dispatch('user/setNotifications', true);

          await registerToken();
        }
      }catch(error) {
        showErrorToast(error);
      }finally {
        areNotificationsDisabled.value = false;
      }
    };
    const chooseLanguage = async() => {
      const picker = await pickerController.create({
        columns: [
          {
            name: 'language',
            options: getLanguages(localization.value),
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
              localization.value = value.language.text;
              picker.dismiss(value.language, "confirm");
            },
          },
        ],
      });
      picker.onDidDismiss().then(async(value) => {
        //Sacuvas izbor korisnika u storage
        const localization = value.data;
        await store.dispatch('user/setLocalization', localization);
      });
      await picker.present();
    };
    const showPrivacy = () => {
      // alert('Privacy');
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
      localization,
      isDarkModeDisabled,
      areNotificationsDisabled,

      /* Event handlers */
      toggleDarkMode,
      toggleNotifications,
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