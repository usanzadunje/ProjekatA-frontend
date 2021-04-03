<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="mt-16">
        <h1 class="ion-text-center ion-text-uppercase text-4xl font-bold">Caffe</h1>
        <h1 class="ion-text-center ion-text-lowercase text-2xl">finder</h1>
      </div>
      <div class="mt-16">
        <h2 class="ion-text-center text-2xl">Registruj se</h2>
        <RegisterForm class="mt-2"></RegisterForm>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import RegisterForm            from "@/components/auth/RegisterForm";
import { IonPage, IonContent } from '@ionic/vue';
import { defineComponent }         from 'vue';

export default defineComponent({
  name: "Register",
  components: {
    RegisterForm,
    IonPage,
    IonContent,
  },
});
</script>