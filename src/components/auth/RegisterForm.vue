<template>
  <form @submit.prevent="register" class="px-5">
    <ion-item lines="none" class="border rounded-2xl h-12 auth-input-background">
      <ion-icon :icon="personOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model.lazy="fname"
          autocomplete="given-name"
          type="text"
          inputmode="text"
          debounce="600"
          placeholder="Ime"
          autofocus required
      ></ion-input>
    </ion-item>
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="personOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model.lazy="lname"
          autocomplete="family-name"
          type="text"
          inputmode="text"
          debounce="600"
          placeholder="Prezime"
          required
      ></ion-input>
    </ion-item>
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="personOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model.lazy="username"
          autocomplete="username"
          type="text"
          inputmode="text"
          debounce="600"
          placeholder="Korisnicko ime"
          required
      ></ion-input>
    </ion-item>
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="mailOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model.lazy="email"
          autocomplete="email"
          type="email"
          inputmode="email"
          debounce="600"
          placeholder="E-mail adresa"
          required
      ></ion-input>
    </ion-item>
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="lockOpenOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model="password"
          debounce="1"
          inputmode="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Lozinka"
          required
      ></ion-input>
      <ion-icon :icon="showPassword ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow(false)"></ion-icon>
    </ion-item>
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="lockOpenOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model="password_confirmation"
          debounce="1"
          inputmode="password"
          :type="showPasswordConfirm ? 'text' : 'password'"
          placeholder="Ponovite lozinku"
          required
      ></ion-input>
      <ion-icon :icon="showPasswordConfirm ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow(true)"></ion-icon>
    </ion-item>
    <SocialIcons class="mt-7"/>
    <div class="padding mt-10">
      <ion-button
          color="primary"
          type="submit"
          size="large"
          expand="block"
          class="auth-button-border-radius uppercase"
      >
        Registruj se
      </ion-button>
      <ion-button
          color="danger"
          routerLink="/login"
          size="large"
          expand="block"
          class="auth-button-border-radius uppercase"
      >
        Prijavi se
      </ion-button>
    </div>
    <FlashMessage :error="error"/>
  </form>
</template>

<script>
import { defineComponent }                                                        from 'vue';
import { IonItem, IonInput, IonIcon, IonButton }                                  from "@ionic/vue";
import AuthService                                                                from "@/services/AuthService";
import { getError }                                                               from '@/utils/helpers';
import FlashMessage                                                               from '@/components/FlashMessage';
import SocialIcons
                                                                                  from '@/components/social/SocialIcons';
import { personOutline, mailOutline, lockOpenOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

export default defineComponent({
  name: "LoginForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    FlashMessage,
    SocialIcons,
  },
  data() {
    return {
      fname: null,
      lname: null,
      bday: null,
      phone: null,
      username: null,
      email: null,
      password: null,
      password_confirmation: null,
      error: null,
      showPassword: false,
      showPasswordConfirm: false,

      /* Icons from ionicon/icons */
      personOutline,
      mailOutline,
      lockOpenOutline,
      eyeOutline,
      eyeOffOutline,
    };
  },
  methods: {
    register() {
      const payload = {
        fname: this.fname,
        lname: this.lname,
        bday: this.bday,
        phone: this.phone,
        username: this.username,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
      };

      AuthService.register(payload)
                 .then(() => this.$router.push({ name: 'onboarding' }))
                 .catch((error) => {
                   this.error = getError(error);
                 });
    },
    togglePasswordShow(passwordConfirm = false) {
      if(passwordConfirm) {
        this.showPasswordConfirm = !this.showPasswordConfirm;
      }else {
        this.showPassword = !this.showPassword;
      }
    },
  },
});
</script>