<template>
  <div class="flex justify-around px-6">
    <div
        @click="login('facebook')"
        class="bg-gray-100 rounded-full text-center social-circle-size"
    >
      <ion-icon :icon="logoFacebook" class="text-blue-400"></ion-icon>
    </div>
    <div
        @click="login('github')"
        class="bg-gray-100 rounded-full text-center social-circle-size"
    >
      <ion-icon :icon="logoGithub" class="text-blue-400"></ion-icon>
    </div>
    <div
        @click="login('instagram')"
        class="bg-gray-100 rounded-full text-center social-circle-size"
    >
      <ion-icon :icon="logoInstagram"></ion-icon>
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
import { defineComponent } from 'vue';

import { useRouter } from 'vue-router';

import store from '@/store';

import { IonIcon } from '@ionic/vue';

import AuthService       from '@/services/AuthService';
import SocialAuthService from '@/services/SocialAuthService';

import { logoFacebook, logoGithub, logoInstagram, logoGoogle } from 'ionicons/icons';

import { GoogleAuth }                                          from '@codetrix-studio/capacitor-google-auth';

export default defineComponent({
  name: "SocialIcons",
  components: {
    IonIcon,
  },
  mounted() {
    GoogleAuth.init();
  },
  setup() {
    /* Global components */
    const router = useRouter();
    /* Event handlers */
    const login = async(driver) => {
      const payload = await SocialAuthService.getUserFromProvider(driver);
      AuthService.authenticateSocial(payload)
                 .then(async() => {
                   await store.dispatch("auth/getAuthUser");
                   await router.push({ name: 'home' });
                 });
    };

    return {
      /* Event handlers */
      login,

      /* Icons */
      logoFacebook,
      logoGithub,
      logoInstagram,
      logoGoogle,
    };
  },
});
</script>