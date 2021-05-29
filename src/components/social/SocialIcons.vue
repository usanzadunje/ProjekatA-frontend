<template>
  <div class="flex justify-around px-6">
    <div class="bg-gray-100 rounded-full text-center align-middle social-circle-size">
      <ion-icon :icon="logoFacebook" class="text-blue-400"></ion-icon>
    </div>
    <div class="bg-gray-100 rounded-full text-center align-middle social-circle-size">
      <ion-icon :icon="logoTwitter" class="text-blue-400"></ion-icon>
    </div>
    <div class="bg-gray-100 rounded-full text-center align-middle social-circle-size">
      <ion-icon :icon="logoInstagram"></ion-icon>
    </div>
    <div class="bg-gray-100 rounded-full text-center align-middle social-circle-size">
      <ion-icon :icon="logoGoogle"></ion-icon>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import { IonIcon } from '@ionic/vue';

import { logoFacebook, logoTwitter, logoInstagram, logoGoogle } from 'ionicons/icons';

export default defineComponent({
  name: "SocialIcons",
  components: {
    IonIcon,
  },
  data() {
    return {
      /* Icons */
      logoFacebook,
      logoTwitter,
      logoInstagram,
      logoGoogle,
    };
  },
});
</script>