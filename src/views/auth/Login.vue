<template>
  <ion-page>
    <ion-content>
      <div id="login" class="flex flex-col justify-between background-image-container safe-pb">
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
import { defineComponent, onMounted } from 'vue';
import { useRouter, useRoute }        from 'vue-router';
import {
  IonPage,
  IonContent,
  useBackButton,
}                                     from '@ionic/vue';

import LoginForm from '@/components/auth/LoginForm';

import { deviceHeight } from '@/composables/useDevice';

export default defineComponent({
  name: "Login",
  components: {
    LoginForm,
    IonPage,
    IonContent,
  },
  setup() {
    /* Global properties */
    const router = useRouter();
    const route = useRoute();

    /* Component properties */

    /* Composables */

    /* Lifecycle hooks */
    useBackButton(10, async(processNextHandler) => {
      if(route.name === 'login') {
        await router.push({ name: 'home' });
      }else {
        processNextHandler();
      }
    });
    onMounted(async() => {
      setTimeout(() => {
        document.querySelector('#login').style.height = `${deviceHeight.value}px`;
      }, 500);
    });


    return {
      /* Component properties */
    };
  },
});
</script>
<style scoped>
#login {
  background: #FFF url('https://resize.rs/storage/img/auth/login-background.png') center top no-repeat scroll;
  background-size: cover;
  height: 100%;
}
</style>