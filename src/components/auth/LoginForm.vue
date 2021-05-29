<template>
  <div class="px-5">
    <ion-item
        lines="none"
        class="border rounded-2xl h-12 auth-input-background"
        :class="{ 'error-border' : errors.hasOwnProperty('email') }"
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
        :class="{ 'error-border' : errors.hasOwnProperty('password') }"
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
import { defineComponent, ref, reactive, computed } from 'vue';

import { useRouter } from 'vue-router';

import { mapGetters } from "vuex";

import store from '@/store/index';


import {
  IonItem,
  IonInput,
  IonIcon,
  IonText,
  IonButton,
  IonCheckbox,
  toastController,
}
  from "@ionic/vue";

import AuthService from "@/services/AuthService";

import SocialIcons from '@/components/social/SocialIcons';

import { getError } from '@/utils/helpers';

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
    let errors = ref({});
    let showPassword = ref(false);

    /* Computed properties */
    //Returns error key name from backend
    const errorKeys = computed(() => {
      if(!errors.value) {
        return null;
      }
      return Object.keys(errors.value);
    });

    /* Methods */
    //Shows error message for specific key
    const getErrors = (key) => {
      return errors.value[key];
    };
    //Generating toast error notifications
    const showToastErrors = async() => {
      let toast = null;
      let i;

      for(i = 0; i < errorKeys.value.length; i++) {
        toast = await toastController.create({
          duration: 1500,
          position: 'top',
          message: getErrors(errorKeys.value[i]),
          cssClass: 'custom-toast',
        });
        toast.style.top = `${55 * i}px`;
        await toast.present();
      }
    };

    /* Event handlers */
    const login = () => {
      AuthService.login(user)
                 .then(async() => {
                   await store.dispatch("auth/getAuthUser");
                   let homeRoute = store.getters["auth/isStaff"] ? { name: 'staff.home' } : { name: 'home' };
                   await router.push(homeRoute);
                 })
                 .catch(async(e) => {
                   errors.value = getError(e);
                   await showToastErrors();

                   //Removing errors after they are all shown
                   setTimeout(() => {
                     errors.value = {};
                   }, Object.keys(errors.value).length * 900);
                 });
    };
    const togglePasswordShow = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      /* Properties */
      user,
      errors,
      showPassword,

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
