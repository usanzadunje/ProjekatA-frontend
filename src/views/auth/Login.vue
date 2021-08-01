<template>
  <ion-page>
    <ion-content>
      <div id="login" class="flex flex-col justify-between background-image-container bg">
        <div class="mt-10 w-full">
          <h1 class="text-center uppercase main-heading">Caffe</h1>
          <h1 class="text-center lowercase main-heading-smaller">finder</h1>
        </div>
        <div class="w-full mb-4">
          <h2 class="text-center secondary-heading">{{ $t('login') }}</h2>
          <LoginForm class="mt-8"></LoginForm>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

import { IonPage, IonContent } from '@ionic/vue';

import LoginForm from '@/components/auth/LoginForm';

export default defineComponent({
  name: "Login",
  components: {
    LoginForm,
    IonPage,
    IonContent,
  },
  setup() {
    let clientHeight = ref(700);

    /* Lifecycle hooks */
    onMounted(() => {
      setTimeout(() => {
        clientHeight.value = document.querySelector('#login').offsetHeight;
        document.querySelector('#login').style.height = `${clientHeight.value}px`;
      }, 500);
    });


    return {
      clientHeight,
    };
  },
});
</script>
<style scoped>
div.bg {
  background: #FFF url('https://resize.rs/storage/img/auth/login-background.png') no-repeat center top fixed;
  background-size: cover;

}
</style>