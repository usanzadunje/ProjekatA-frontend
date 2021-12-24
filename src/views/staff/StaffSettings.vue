<template>
  <ion-page>
    <ion-content>
      <ion-header class="ion-no-border mt-2">
        <ion-toolbar class="ion-no-padding">
          <ion-item class="no-border">
            <h1 class="settings-heading">{{ $t('settings') }}</h1>
          </ion-item>
        </ion-toolbar>
      </ion-header>

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
        <ion-item class="ion-item-padding-right" @click="this.$router.push({name:'staff.profile'})">
          <p class="settings-item-text">{{ $t('profile') }}</p>
          <ion-button fill="clear" slot="end">
            <ion-icon slot="icon-only" :icon="chevronForward" class="text-gray-400"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">{{ $t('language') }}</p>
          <AppLanguagePicker class="lang-pl"/>
        </ion-item>
        <ion-item class="ion-item-padding-right">
          <p class="settings-item-text">{{ $t('primaryColor') }}</p>
          <ColorPicker slot="end"/>
        </ion-item>
      </div>
      <div class="mt-5">
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
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonToggle,
}                                         from '@ionic/vue';

import AppLanguagePicker from '@/components/AppLanguagePicker';
import ColorPicker       from '@/components/ColorPicker';

import { chevronForward, flash } from 'ionicons/icons';

export default defineComponent({
  name: 'UserSettings',
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
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


    /* Composables */
    /* Event handlers */
    const toggleDarkMode = async(e) => {
      isDarkModeDisabled.value = true;

      if(e.target.checked) {
        await store.dispatch('user/setDarkMode', false);
      }else {
        await store.dispatch('user/setDarkMode', true);
      }

      isDarkModeDisabled.value = false;
    };


    return {
      /* Component properties */
      isDarkModeOn,
      areNotificationsOn,
      isDarkModeDisabled,

      /* Event handlers */
      toggleDarkMode,


      /* Icons from */
      flash,
      chevronForward,
    };
  },
});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
  background: var(--show-paint);
}

ion-item {
  --background: var(--show-paint);
  --border-color: rgba(112, 112, 112, 0.1);
  --inner-padding-end: 0;
}

ion-item.item-has-focus {
  border: unset !important;
  --highlight-background: transparent !important;
}

.ion-item-padding-right {
  --padding-end: 20px;
}

ion-toolbar {
  background: var(--show-paint);
  --background: var(--show-paint);
  border-bottom-left-radius: unset !important;
  border-bottom-right-radius: unset !important;
}
</style>