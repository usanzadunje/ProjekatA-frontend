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
import { defineComponent, onMounted } from 'vue';
import { useRouter }                  from 'vue-router';
import { useStore }                   from 'vuex';
import { IonIcon }                    from '@ionic/vue';

import AuthService       from '@/services/AuthService';
import SocialAuthService from '@/services/SocialAuthService';

import { useErrorHandling } from '@/composables/useErrorHandling';
import { deviceInfo }       from '@/composables/useDevice';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

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

    /* Component properties */
    /* Composables */
    onMounted(async() => {
      GoogleAuth.init();
    });
    /* Composables */
    const { tryCatch } = useErrorHandling();

    /* Event handlers */
    const login = async(driver) => {
      await tryCatch(
          async() => {
            const payload = await SocialAuthService.getUserFromProvider(driver);
            payload.device_name = (deviceInfo?.value?.name || deviceInfo?.value?.model) || `${payload.email} Phone`;
            const response = await AuthService.authenticateSocial(payload);

            await store.dispatch("auth/setToken", response.data.token);
            await store.dispatch("user/getSettings");

            await router.replace({ name: 'home' });
          },
          {
            successMessageKey: 'successLogin',
          },
      );
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