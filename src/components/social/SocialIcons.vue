<template>
  <div class="flex justify-around px-6">
    <div style="height:40px; width:40px; line-height: 45px" class="bg-gray-200 rounded-full text-center align-middle">
      <ion-icon :icon="logoFacebook" size="small"></ion-icon>
    </div>
    <div style="height:40px; width:40px; line-height: 45px" class="bg-gray-200 rounded-full text-center align-middle">
      <ion-icon :icon="logoTwitter" size="small"></ion-icon>
    </div>
    <div style="height:40px; width:40px; line-height: 45px" class="bg-gray-200 rounded-full text-center align-middle">
      <ion-icon :icon="logoInstagram" size="small"></ion-icon>
    </div>
    <div style="height:40px; width:40px; line-height: 45px" class="bg-gray-200 rounded-full text-center align-middle">
      <ion-icon :icon="logoGoogle" size="small"></ion-icon>
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