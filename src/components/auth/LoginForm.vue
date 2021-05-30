<template>
  <div class="px-5">
    <ion-item
        lines="none"
        class="border rounded-2xl h-12 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('email') }"
    >
      <ion-icon :icon="mailOutline" class="mr-2 text-black"></ion-icon>
      <ion-input
          v-model.lazy="user.email"
          autocomplete="email"
          type="email"
          inputmode="email"
          debounce="600"
          placeholder="marko.markovic@gmail.com"
          class="input-text"
          autofocus required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="border rounded-2xl h-12 mt-3.5 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('email') }"
    >
      <ion-icon :icon="lockOpenOutline" class="mr-2 text-black"></ion-icon>
      <ion-input
          v-model="user.password"
          inputmode="password"
          :type="showPassword ? 'text' : 'password'"
          debounce="1"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
      ></ion-input>
      <ion-icon :icon="showPassword ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow"
                class="text-black"
      ></ion-icon>
    </ion-item>
    <div class="flex justify-between mt-3.5 px-4 utility-text">
      <div class="align-text-bottom">
        <ion-checkbox
            class="align-text-bottom"
            v-model="user.remember"
            mode="md"
        ></ion-checkbox>
        <ion-text class="ml-2">Zapamti me</ion-text>
      </div>
      <a href="/forgot-password" class="mt-0.5">Zaboravljena lozinka?</a>
    </div>
    <SocialIcons class="mt-7"/>
    <div class="padding mt-10 mb-10">
      <ion-button
          size="large"
          expand="block"
          class="auth-button-border-radius uppercase button-text-white"
          @click="login"
      >
        Prijavi se
      </ion-button>
      <ion-button
          fill="clear"
          routerLink="/register"
          size="large"
          expand="block"
          class="auth-button-border-radius uppercase button-text-black mt-7"
      >
        Registruj se
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';

import { useRouter } from 'vue-router';

import { mapGetters } from "vuex";

import store from '@/store/index';

import { getError, sleep } from "@/utils/helpers"


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
} from 'ionicons/icons';

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
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();

    /* Component properties */
    let user = reactive({});
    let showPassword = ref(false);
    let errorNames = ref({});


    /* Methods */
    const { showErrorToast, showSuccessToast } = useToastNotifications();


    /* Event handlers */
    const login = () => {
      AuthService.login(user)
                 .then(async() => {
                   await store.dispatch("auth/getAuthUser");
                   let homeRoute = store.getters["auth/isStaff"] ? { name: 'staff.home' } : { name: 'home' };
                   await router.push(homeRoute);
                   await showSuccessToast('Success logged in!');
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
