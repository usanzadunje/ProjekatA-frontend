<template>
  <ion-page>
    <ion-content>
      <div id="login" class="relative background-image-container bg">
        <div class="absolute logo-position-login w-full">
          <h1 class="text-center uppercase main-heading">Caffe</h1>
          <h1 class="text-center lowercase main-heading-smaller">finder</h1>
        </div>
        <div class="absolute content-position-login w-full mb-4">
          <h2 class="text-center secondary-heading">Prijavi se</h2>
          <LoginForm class="mt-8"></LoginForm>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { IonPage, IonContent } from '@ionic/vue';

import LoginForm from '@/components/auth/LoginForm';

export default defineComponent({
  name: "Login",
  components: {
    LoginForm,
    IonPage,
    IonContent,
  },
  mounted() {
    setTimeout(() => {
      this.clientHeight = document.querySelector('#login').offsetHeight;
    }, 500)
  },
  setup() {
    let clientHeight = ref(700);

    window.addEventListener("keyboardDidShow", () => {
      document.querySelector('#login').style.height = `${clientHeight.value}px`
    });

    return {
      clientHeight,
    }
  }
});
</script>
<style scoped>
div.bg {
  background: #FFF url('https://resize.rs/storage/img/auth/login-background.png') no-repeat center top fixed;
  background-size: cover;

}
</style>