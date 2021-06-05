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


import { IonIcon } from '@ionic/vue';

import { logoFacebook, logoGithub, logoInstagram, logoGoogle } from 'ionicons/icons';

export default defineComponent({
  name: "SocialIcons",
  components: {
    IonIcon,
  },
  setup() {
    /* Global components */

    /* Event handlers */
    const login = async(driver) => {
      window.location.href = `http://192.168.1.203:8200/auth/${driver}/redirect`;
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