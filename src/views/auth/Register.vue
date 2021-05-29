<template>
  <ion-page>
    <ion-content>
      <div class="bg">
        <div>
          <h1 class="text-center uppercase main-heading">Caffe</h1>
          <h1 class="text-center lowercase main-heading-smaller">finder</h1>
        </div>
        <div class="mt-28">
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
});
</script>
<style scoped>
div.bg {
  background: url('../../assets/img/auth/login-background.png') no-repeat center top fixed;
  -webkit-background-size: cover !important;
  -moz-background-size: cover !important;
  -o-background-size: cover !important;
  background-size: cover !important;
}
</style>