<template>
  <div class="px-5">
    <ion-item
        lines="none"
        class="border rounded-2xl h-12 auth-input-background"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-black"></ion-icon>
      <ion-input
          v-model.lazy="newUser.fname"
          autocomplete="given-name"
          type="text"
          inputmode="text"
          debounce="600"
          placeholder="Ime"
          autofocus required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="border rounded-2xl h-12 mt-3.5 auth-input-background"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-black"></ion-icon>
      <ion-input
          v-model.lazy="newUser.lname"
          autocomplete="family-name"
          type="text"
          inputmode="text"
          debounce="600"
          placeholder="Prezime"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="border rounded-2xl h-12 mt-3.5 auth-input-background"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-black"></ion-icon>
      <ion-input
          v-model.lazy="newUser.username"
          autocomplete="username"
          type="text"
          inputmode="text"
          debounce="600"
          placeholder="Korisnicko ime"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="border rounded-2xl h-12 mt-3.5 auth-input-background"
    >
      <ion-icon :icon="mailOutline" class="mr-2 text-black"></ion-icon>
      <ion-input
          v-model.lazy="newUser.email"
          autocomplete="email"
          type="email"
          inputmode="email"
          debounce="600"
          placeholder="E-mail adresa"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="border rounded-2xl h-12 mt-3.5 auth-input-background"
    >
      <ion-icon :icon="lockOpenOutline" class="mr-2 text-black"></ion-icon>
      <ion-input
          v-model="newUser.password"
          debounce="1"
          inputmode="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Lozinka"
          required
      ></ion-input>
      <ion-icon :icon="showPassword ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow(false)"
                class="text-black"
      >

      </ion-icon>
    </ion-item>
    <ion-item
        lines="none"
        class="border rounded-2xl h-12 mt-3.5 auth-input-background"
    >
      <ion-icon :icon="lockOpenOutline" class="mr-2 text-black"></ion-icon>
      <ion-input
          v-model="newUser.password_confirmation"
          debounce="1"
          inputmode="password"
          :type="showPasswordConfirm ? 'text' : 'password'"
          placeholder="Ponovite lozinku"
          required
      ></ion-input>
      <ion-icon :icon="showPasswordConfirm ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow(true)"
                class="text-black"
      ></ion-icon>
    </ion-item>
    <SocialIcons class="mt-7"/>
    <div class="padding mt-10 mb-10">
      <ion-button
          size="large"
          expand="block"
          class="auth-button-border-radius uppercase button-text-white"
          @click="register"
      >
        Registruj se
      </ion-button>
      <ion-button
          fill="clear"
          routerLink="/login"
          size="large"
          expand="block"
          class="auth-button-border-radius uppercase button-text-black mt-7"
      >
        Prijavi se
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';

import { useRouter } from 'vue-router';

import { IonItem, IonInput, IonIcon, IonButton } from "@ionic/vue";

import AuthService from "@/services/AuthService";

import SocialIcons from '@/components/social/SocialIcons';

import {
  personOutline,
  mailOutline,
  lockOpenOutline,
  eyeOutline,
  eyeOffOutline,
}                                from 'ionicons/icons';
import { useToastNotifications } from '@/composables/useToastNotifications';


export default defineComponent({
  name: "RegisterForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    SocialIcons,
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();

    /* Component properties */
    let newUser = reactive({});
    let showPassword = ref(false);
    let showPasswordConfirm = ref(false);

    /* Methods */
    const { showErrorToast, showSuccessToast } = useToastNotifications();

    /* Event handlers */
    let register = () => {
      Object.assign(newUser, newUser, { bday: null, phone: null });
      AuthService.register(newUser)
                 .then(async() => {
                   await router.push({ name: 'onboarding' });
                   await showSuccessToast('You have successfully registered!');
                 })
                 .catch(async(errors) => {
                   await showErrorToast(errors);
                 });
    };
    let togglePasswordShow = (passwordConfirm = false) => {
      if(passwordConfirm) {
        showPasswordConfirm.value = !showPasswordConfirm.value;
      }else {
        showPassword.value = !showPassword.value;
      }
    };

    return {
      /* Properties */
      newUser,
      showPassword,
      showPasswordConfirm,

      /* Event handlers */
      register,
      togglePasswordShow,

      /* Icons from  */
      personOutline,
      mailOutline,
      lockOpenOutline,
      eyeOutline,
      eyeOffOutline,
    };
  },
})
;
</script>