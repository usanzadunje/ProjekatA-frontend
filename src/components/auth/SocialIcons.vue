<template>
  <div class="flex justify-around items-center px-6">
    <div
        class="flex justify-center items-center bg-gray-100 rounded-full social-circle-size"
        @click="login('facebook')"
    >
      <ion-icon :icon="logoFacebook" class="text-blue-400"></ion-icon>
    </div>
    <div
        class="flex justify-center items-center bg-gray-100 rounded-full social-circle-size"
        @click="login('google')"
    >
      <ion-icon :icon="logoGoogle"></ion-icon>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter }                       from 'vue-router';
import { useStore }                        from 'vuex';
import { useI18n }                         from 'vue-i18n';
import { IonIcon }                         from '@ionic/vue';

import AuthService       from '@/services/AuthService';
import SocialAuthService from '@/services/SocialAuthService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { getError, sleep } from '@/utils/helpers';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Device }     from '@capacitor/device';

import { logoFacebook, logoGoogle } from 'ionicons/icons';

export default defineComponent({
  name: "SocialIcons",
  components: {
    IonIcon,
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    const errorNames = ref({});

    /* Composables */
    onMounted(async() => {
      GoogleAuth.init();
    });
    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Event handlers */
    const login = async(driver) => {

      try {
        const deviceInfo = await Device.getInfo();
        const payload = await SocialAuthService.getUserFromProvider(driver);
        payload.device_name = deviceInfo.name || deviceInfo.model;
        const response = await AuthService.authenticateSocial(payload);

        await store.dispatch("auth/setToken", response.data.token);
        await store.dispatch("user/getSettings");

        await router.replace({ name: 'home' });
        showSuccessToast(t('successLogin'));
      }catch(errors) {
        errorNames.value = getError(errors);
        await showErrorToast(errors);
        await sleep(Object.keys(errorNames.value).length * 900);
        errorNames.value = {};
      }
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