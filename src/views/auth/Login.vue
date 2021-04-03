<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="mt-16">
        <h1 class="ion-text-center ion-text-uppercase text-4xl font-bold">Caffe</h1>
        <h1 class="ion-text-center ion-text-lowercase text-2xl">finder</h1>
      </div>
      <div class="mt-16">
        <h2 class="ion-text-center text-2xl">Prijavi se</h2>
        <LoginForm class="mt-2"></LoginForm>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent } from '@ionic/vue';
import LoginForm               from '@/components/auth/LoginForm';
import { defineComponent }         from 'vue';

export default defineComponent({
  name: "Login",
  components: {
    LoginForm,
    IonPage,
    IonContent,
  },
});
</script>