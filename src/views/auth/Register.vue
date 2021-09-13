<template>
  <ion-page>
    <ion-content>
      <div id="register" class="flex flex-col justify-between background-image-container">
        <div class="mt-10 w-full">
          <h1 class="text-center uppercase main-heading">Caffe</h1>
          <h1 class="text-center lowercase main-heading-smaller">finder</h1>
        </div>
        <div
            id="content"
            class="w-full mt-10 mb-4"
        >
          <h2 class="text-center secondary-heading">{{ $t('register') }}</h2>
          <RegisterForm class="mt-8"></RegisterForm>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }     from 'vue';
import { IonPage, IonContent } from '@ionic/vue';

import RegisterForm from "@/components/auth/RegisterForm";


export default defineComponent({
  name: "Register",
  components: {
    RegisterForm,
    IonPage,
    IonContent,
  },
  setup() {
    /* Global properties */

    /* Composables */

    return {};
  },
});
</script>
<style scoped>
ion-content {
  --background: #FFF;
}

#register {
  background: #FFF url('https://resize.rs/storage/img/auth/registration-background.png') center top no-repeat scroll;
  background-size: cover;
}
</style>