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
                mode="md"
                @click="toggleDarkMode($event)"
            ></ion-toggle>
          </ion-item>
        </ion-item>
        <ion-item class="ion-item-padding-right" routerLink="/edit">
          <p class="settings-item-text">{{ $t('profile') }}</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">{{ $t('notification', 2) }}</p>
          <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pull-right">
            <ion-label class="settings-fade-text">{{ areNotificationsOn ? 'ON' : 'OFF' }}</ion-label>
            <ion-toggle
                :disabled="areNotificationsDisabled"
                :checked="areNotificationsOn"
                mode="md"
                @click="toggleNotifications($event)"
            ></ion-toggle>
          </ion-item>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">{{ $t('language') }}</p>
          <AppLanguagePicker class="lang-pl"/>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">{{ $t('primaryColor') }}</p>
          <ColorPicker/>
        </ion-item>
      </div>
      <div class="mt-5">
        <ion-item class="flex justify-start no-border">
          <div class="settings-icon-badge settings-yellow-icon-color flex justify-center settings-padding-icon-top">
            <ion-icon :icon="rocket" class="text-white"></ion-icon>
          </div>
          <p class="uppercase settings-fade-text ml-2">{{ $t('about') }}</p>
        </ion-item>
        <ion-item class="ion-item-padding-right" @click="showPrivacyPolicy">
          <p class="settings-item-text">{{ $t('privacyPolicy') }}</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
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
            class="mt-5 uppercase logout-button user-selected-color"
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
import { computed, defineComponent, ref } from 'vue';
import { useStore }                       from 'vuex';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonToggle,
}                                         from '@ionic/vue';

import AppLanguagePicker from '@/components/AppLanguagePicker';
import ColorPicker       from '@/components/ColorPicker';

import AuthService from '@/services/AuthService';

import { useFCM }                from '@/composables/useFCM';
import { useToastNotifications } from '@/composables/useToastNotifications';

import { chevronForward, flash, rocket } from 'ionicons/icons';

import { Capacitor } from '@capacitor/core';

export default defineComponent({
  name: 'UserSettings',
  components: {
    IonContent,
    IonPage,
    IonItem,
    IonIcon,
    IonLabel,
    IonToggle,
    IonButton,
    AppLanguagePicker,
    ColorPicker,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const isDarkModeOn = computed(() => store.getters['user/darkMode']);
    const areNotificationsOn = computed(() => store.getters['user/notifications']);
    const isDarkModeDisabled = ref(false);
    const areNotificationsDisabled = ref(false);

    if(Capacitor.getPlatform() === 'web') {
      areNotificationsDisabled.value = true;
    }

    /* Methods */
    const { registerToken } = useFCM();
    const { showErrorToast } = useToastNotifications();

    /* Event handlers */
    const toggleDarkMode = async(e) => {
      isDarkModeDisabled.value = true;
      try {
        if(e.target.checked) {
          await store.dispatch('user/setDarkMode', false);
        }else {
          await store.dispatch('user/setDarkMode', true);
        }
      }catch(error) {
        showErrorToast(error);
      }finally {
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
    const showPrivacyPolicy = () => {
      alert('Privacy policy');
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
      isDarkModeDisabled,
      areNotificationsDisabled,

      /* Event handlers */
      toggleDarkMode,
      toggleNotifications,
      showPrivacyPolicy,
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