<template>
  <ion-page>
    <ion-content>
      <div class="bg">
        <div>
          <h1 class="text-center uppercase main-heading">Caffe</h1>
          <h1 class="text-center lowercase main-heading-smaller">finder</h1>
        </div>
        <div class="mt-40">
          <h2 class="text-center secondary-heading">Prijavi se</h2>
          <LoginForm class="mt-8"></LoginForm>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }     from 'vue';
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
div.bg {
  background: url('../../assets/img/auth/login-background.png') no-repeat center top fixed;
  -webkit-background-size: cover !important;
  -moz-background-size: cover !important;
  -o-background-size: cover !important;
  background-size: cover !important;
}
</style>