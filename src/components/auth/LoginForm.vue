<template>
  <div id="custom" class="px-8">
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('email') }"
    >
      <ion-icon :icon="mailOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="emailInput"
          v-model.lazy="user.email"
          @keyup.enter="passwordInput.$el?.setFocus()"
          autocomplete="email"
          type="email"
          inputmode="email"
          debounce="600"
          placeholder="marko.markovic@gmail.com"
          autofocus required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('email') }"
    >
      <ion-icon :icon="lockOpenOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="passwordInput"
          v-model="user.password"
          @keyup.enter="login"
          inputmode="password"
          :type="showPassword ? 'text' : 'password'"
          debounce="1"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
      ></ion-input>
      <ion-icon :icon="showPassword ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow"
                class="text-xl text-gray-500"
      ></ion-icon>
    </ion-item>
    <div class="relative flex justify-between mt-3.5 px-4 utility-text">
      <div class="relative">
        <ion-checkbox
            v-model="user.remember"
            mode="md"
        ></ion-checkbox>
        <ion-text class="ml-2 absolute top-1/2 transform -translate-y-1/2">Zapamti me</ion-text>
      </div>
      <div class="w-32 absolute top-1/2 right-0 transform -translate-y-1/2">
        <a href="/forgot-password">Zaboravljena lozinka?</a>
      </div>
    </div>
    <SocialIcons class="mt-7"/>
    <div class="mt-6">
      <ion-button
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white"
          @click="login"
      >
        Prijavi se
      </ion-button>
      <ion-button
          fill="clear"
          routerLink="/register"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
      >
        Registruj se
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';

import { useRouter } from 'vue-router';

import store from '@/store/index';

import { Device } from '@capacitor/device';

import { getError, sleep } from "@/utils/helpers";

import {
  IonItem,
  IonInput,
  IonIcon,
  IonText,
  IonButton,
  IonCheckbox,
}
  from "@ionic/vue";

import AuthService from "@/services/AuthService";

import SocialIcons from '@/components/social/SocialIcons';

import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  mailOutline,
  lockOpenOutline,
  eyeOutline,
  eyeOffOutline,
}                     from 'ionicons/icons';
import { useStorage } from '@/services/StorageService';

export default defineComponent({
  name: "LoginForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonText,
    IonButton,
    IonCheckbox,
    SocialIcons,
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();
    const { set } = useStorage();


    /* Component properties */
    let user = reactive({});
    let showPassword = ref(false);
    let errorNames = ref({});
    const passwordInput = ref(null);
    const emailInput = ref(null);

    /* Lifecycle hooks */
    onMounted(async() => {
      const deviceInfo = await Device.getInfo();
      user.device_name = deviceInfo.name || deviceInfo.model;
    });

    /* Methods */
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Event handlers */
    const login = () => {
      AuthService.login(user)
                 .then(async(response) => {
                   await set(`projekata_token`, response.data);
                   await store.dispatch("auth/getAuthUser");
                   let homeRoute = store.getters["auth/isStaff"] ? { name: 'staff.home' } : { name: 'home' };
                   user.email = '';
                   user.password = '';
                   await router.push(homeRoute);
                   await showSuccessToast('Successfully logged in!');
                 })
                 .catch(async(errors) => {
                   errorNames.value = getError(errors);
                   await showErrorToast(errors);
                   await sleep(Object.keys(errorNames.value).length * 900);
                   errorNames.value = {};
                 });

    };
    const togglePasswordShow = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      /* Component properties */
      user,
      showPassword,
      errorNames,
      passwordInput,
      emailInput,

      /* Event handlers  */
      login,
      togglePasswordShow,

      /* Icons */
      mailOutline,
      lockOpenOutline,
      eyeOutline,
      eyeOffOutline,
    };
  },
});
</script>
<style scoped>
ion-text{
  width: 60px !important;
}
</style>