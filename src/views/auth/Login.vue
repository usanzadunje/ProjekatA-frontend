<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="mt-28">
        <h1 class="text-center uppercase main-heading">Caffe</h1>
        <h1 class="text-center lowercase main-heading-smaller">finder</h1>
      </div>
      <div class="mt-40">
        <h2 class="text-center secondary-heading">Prijavi se</h2>
        <LoginForm class="mt-8"></LoginForm>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }         from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import LoginForm               from '@/components/auth/LoginForm';

export default defineComponent({
  name: "Login",
  components: {
    LoginForm,
    IonPage,
    IonContent,
  },
});
</script>
<style scoped>
ion-content{
  --background: url('../../assets/img/auth/LoginBackground.png') no-repeat;
}
</style>