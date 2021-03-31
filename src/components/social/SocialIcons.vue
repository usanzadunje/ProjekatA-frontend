<template>
  <div class="flex justify-around px-6">
    <div class="bg-gray-100 rounded-full text-center align-middle social-circle-size">
      <ion-icon :icon="logoFacebook"></ion-icon>
    </div>
    <div class="bg-gray-100 rounded-full text-center align-middle social-circle-size">
      <ion-icon :icon="logoTwitter"></ion-icon>
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
import { IonIcon }         from '@ionic/vue';
import { logoFacebook, logoTwitter, logoInstagram, logoGoogle }                from '@/assets/icons';

export default defineComponent({
  name: "SocialIcons",
  components: {
    IonIcon,
  },
  data() {
    return {
      logoFacebook,
      logoTwitter,
      logoInstagram,
      logoGoogle
    };
  },
});
</script>