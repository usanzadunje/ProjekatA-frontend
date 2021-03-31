<template>
  <form @submit.prevent="login" class="px-5">
    <ion-item lines="none" class="border rounded-2xl h-12">
      <ion-icon :icon="mailOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model.lazy="email"
          autocomplete="email"
          type="email"
          inputmode="email"
          debounce="600"
          pattern="email"
          placeholder="marko.markovic@gmail.com"
          autofocus required
      ></ion-input>
    </ion-item>
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5">
      <ion-icon :icon="lockOpenOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model.lazy="password"
          class="--background"
          inputmode="password"
          :type="showPasswordEye ? 'password' : 'text'"
          debounce="600"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
      ></ion-input>
      <ion-icon :icon="showPasswordEye ? eyeOutline : eyeOffOutline" @click="togglePasswordShow"></ion-icon>
    </ion-item>
    <div class="flex justify-between mt-3.5 px-4">
      <div>
        <ion-checkbox class="align-text-top"></ion-checkbox>
        <ion-text class="ml-2">Zapamti me</ion-text>
      </div>
      <ion-router-link href="/forgot-password">Zaboravljena lozinka?</ion-router-link>
    </div>
    <SocialIcons class="mt-7"/>
    <div class="padding mt-10">
      <ion-button
          color="primary"
          type="submit"
          size="large"
          expand="block"
          class="auth-button-border-radius uppercase"
      >
        Prijavi se
      </ion-button>
      <ion-button
          color="danger"
          routerLink="/register"
          size="large"
          expand="block"
          class="auth-button-border-radius uppercase"
      >
        Registruj se
      </ion-button>
    </div>
    <FlashMessage :error="error"/>
  </form>
</template>

<script>
import { defineComponent }                                         from 'vue';
import { IonItem, IonInput, IonIcon, IonRouterLink, IonText }      from "@ionic/vue";
import store                                                       from '@/store/index';
import { mapGetters }                                              from "vuex";
import AuthService                                                 from "@/services/AuthService";
import { getError }                                                from '@/utils/helpers';
import FlashMessage                                                from '@/components/FlashMessage';
import SocialIcons                                                 from '@/components/social/SocialIcons';
import { mailOutline, lockOpenOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

export default defineComponent({
  name: "LoginForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonRouterLink,
    IonText,
    FlashMessage,
    SocialIcons,
  },
  data() {
    return {
      email: null,
      password: null,
      error: null,
      showPasswordEye: true,

      /* Icons from ionicon/icons */
      mailOutline,
      lockOpenOutline,
      eyeOutline,
      eyeOffOutline,
    };
  },
  methods: {
    login() {
      const payload = {
        email: this.email,
        password: this.password,
      };

      AuthService.login(payload)
                 .then(async() => {
                   await store.dispatch("auth/getAuthUser");
                   let homeRoute = store.getters["auth/isStaff"] ? { name: 'staff.home' } : { name: 'home' };
                   this.$router.push(homeRoute);
                 })
                 .catch((error) => {
                   this.error = getError(error);
                   this.$emit('loginError', {
                     error: this.error,
                   });
                 });
    },
    togglePasswordShow() {
      this.showPasswordEye = !this.showPasswordEye;
    },
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
});
</script>