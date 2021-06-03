<template>
  <ion-page>
    <ion-content>
      <div class="relative background-image-container bg">
        <div class="absolute logo-position-login w-full">
          <h1 class="text-center uppercase main-heading">Caffe</h1>
          <h1 class="text-center lowercase main-heading-smaller">finder</h1>
        </div>
        <div
            id="content"
            class="absolute w-full mb-4"
        >
          <h2 class="text-center secondary-heading">Registruj se</h2>
          <RegisterForm class="mt-8"></RegisterForm>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';

import RegisterForm from "@/components/auth/RegisterForm";

import { IonPage, IonContent } from '@ionic/vue';

export default defineComponent({
  name: "Register",
  components: {
    RegisterForm,
    IonPage,
    IonContent,
  },
  mounted() {
    if(this.clientDeviceHeight > 720) {
      document.getElementById('content').style.bottom = '0';
    }else {
      document.getElementById('content').style.top = '40%';
    }
  },
  data() {
    return {
      clientDeviceHeight: document.documentElement.clientHeight ?? 500,
    };
  },
});
</script>
<style scoped>
ion-content {
  --background: #FFF;
}

div.bg {
  background: #FFF url('http://192.168.1.203:8200/storage/img/auth/registration-background.png') no-repeat center top fixed;
  background-size: cover;
}
</style>