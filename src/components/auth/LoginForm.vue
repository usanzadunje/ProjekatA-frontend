<template>
  <form @submit.prevent="login" class="px-5">
    <ion-item lines="none" class="border rounded-2xl">
      <ion-icon :icon="mailOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model.lazy="email"
          class="--background"
          autocomplete="email"
          type="email"
          inputmode="email"
          debounce="600"
          pattern="email"
          placeholder="marko.markovic@gmail.com"
          autofocus required
      ></ion-input>
    </ion-item>
    <ion-item lines="none" class="mt-3.5 border rounded-2xl">
      <ion-icon :icon="lockOpenOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model.lazy="password"
          class="--background"
          inputmode="password"
          type="password"
          debounce="600"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
      ></ion-input>
    </ion-item>
    <div class="flex justify-between mt-3.5">
      <div>
        <ion-checkbox></ion-checkbox>
        <ion-text class="ml-1">Zapamti me</ion-text>
      </div>
      <ion-anchor>Zaboravljena lozinka?</ion-anchor>
    </div>
    <SocialIcons class="mt-3.5"/>
    <div class="padding">
      <ion-button size="large" type="submit" expand="block">Login
      </ion-button>
      <ion-button color="primary" href="/forgot-password">Forgot Password?</ion-button>
    </div>
    <FlashMessage :error="error"/>
  </form>
</template>

<script>
import { defineComponent }                                           from 'vue';
import { IonItem, IonInput, IonButton, IonIcon, IonAnchor, IonText } from "@ionic/vue";
import store                                                         from '@/store/index';
import { mapGetters }                                                from "vuex";
import AuthService                                                   from "@/services/AuthService";
import { getError }                                                  from '@/utils/helpers';
import FlashMessage                                                  from '@/components/FlashMessage';
import SocialIcons                                                   from '@/components/social/SocialIcons';
import { mailOutline, lockOpenOutline }                              from 'ionicons/icons';

export default defineComponent({
  name: "LoginForm",
  components: {
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonAnchor,
    IonText,
    FlashMessage,
    SocialIcons
  },
  data() {
    return {
      email: null,
      password: null,
      error: null,
      /* Icons from ionicon/icons*/
      mailOutline,
      lockOpenOutline,
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
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
});
</script>