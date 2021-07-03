<template>
  <div class="flex justify-around px-6">
    <div
        @click="login('facebook')"
        class="bg-gray-100 rounded-full text-center social-circle-size"
    >
      <ion-icon :icon="logoFacebook" class="text-blue-400"></ion-icon>
    </div>
    <div
        @click="login('google')"
        class="bg-gray-100 rounded-full text-center social-circle-size"
    >
      <ion-icon :icon="logoGoogle"></ion-icon>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { useRouter } from 'vue-router';

import store from '@/store';

import { IonIcon } from '@ionic/vue';

import AuthService       from '@/services/AuthService';
import SocialAuthService from '@/services/SocialAuthService';

import { logoFacebook, logoGoogle } from 'ionicons/icons';

import { GoogleAuth }            from '@codetrix-studio/capacitor-google-auth';
import { useToastNotifications } from '@/composables/useToastNotifications';
import { Device }                from '@capacitor/device';
import { useStorage }            from '@/services/StorageService';
import { getError, sleep }       from '@/utils/helpers';

export default defineComponent({
  name: "SocialIcons",
  components: {
    IonIcon,
  },
  mounted() {
    GoogleAuth.init();
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();
    const { set } = useStorage();

    /* Component properties */
    let errorNames = ref({});

    /* Methods */
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Event handlers */
    const login = async(driver) => {
      const deviceInfo = await Device.getInfo();
      const payload = await SocialAuthService.getUserFromProvider(driver);
      payload.device_name = deviceInfo.name || deviceInfo.model;

      AuthService.authenticateSocial(payload)
                 .then(async(response) => {
                   await set(`projekata_token`, response.data);
                   await store.dispatch("auth/getAuthUser");
                   await router.push({ name: 'home' });
                   await showSuccessToast('Success logged in!');
                 })
                 .catch(async(errors) => {
                   errorNames.value = getError(errors);
                   await showErrorToast(errors);
                   await sleep(Object.keys(errorNames.value).length * 900);
                   errorNames.value = {};
                 });
    };

    return {
      /* Event handlers */
      login,

      /* Icons */
      logoFacebook,
      logoGoogle,
    };
  },
});
</script>