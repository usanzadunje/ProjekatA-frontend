<template>
  <div id="custom" class="px-8 mt-20">
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('fname') }"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-model.lazy="user.fname"
          @keyup.enter="lnameInput.$el?.setFocus()"
          type="text"
          debounce="600"
          :placeholder="$t('fname')"
          autofocus required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('lname') }"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="lnameInput"
          v-model="user.lname"
          @keyup.enter="usernameInput.$el?.setFocus()"
          type="text"
          debounce="600"
          :placeholder="$t('lname')"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('username') }"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="usernameInput"
          v-model="user.username"
          @keyup.enter="emailInput.$el?.setFocus()"
          type="text"
          debounce="600"
          :placeholder="$t('username')"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('email') }"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="emailInput"
          v-model="user.email"
          @keyup.enter="phoneInput.$el?.setFocus()"
          type="email"
          debounce="600"
          :placeholder="$t('email')"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('bday') }"
    >
      <ion-label class="text-gray-400">{{ $t('birthday') }}</ion-label>
      <ion-datetime
          v-model="user.bday"
          :doneText="$t('done')"
          :cancelText="$t('cancel')"
          display-format="DD MMM YYYY"
          value="1997-07-21"
          :placeholder="$t('selectDate')"
      ></ion-datetime>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('phone') }"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="phoneInput"
          v-model="user.phone"
          @keyup.enter="bdayInput.$el?.setFocus()"
          type="tel"
          debounce="600"
          :placeholder="$t('phone')"
          required
      ></ion-input>
    </ion-item>

    <div class="mt-6">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="login"
      >
        {{ loading ? $t('checking') : $t('update') }}
        <ion-spinner v-if="loading" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
      <ion-button
          :disabled="loading"
          fill="clear"
          routerLink="/register"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
      >
        {{ $t('cancel') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';

import { useRouter } from 'vue-router';

import store from '@/store/index';

import { Keyboard } from '@capacitor/keyboard';


import { getError, sleep } from "@/utils/helpers";

import {
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSpinner,
  IonDatetime,
  IonLabel,
}
  from "@ionic/vue";

import AuthService from "@/services/AuthService";

import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  mailOutline,
  lockOpenOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "LoginForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonSpinner,
    IonDatetime,
    IonLabel,
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();

    /* Component properties */
    let user = reactive({});
    let showPassword = ref(false);
    let errorNames = ref({});
    const fnameInput = ref(null);
    const lnameInput = ref(null);
    const usernameInput = ref(null);
    const emailInput = ref(null);
    const bdayInput = ref(null);
    const phoneInput = ref(null);
    const passwordInput = ref(null);
    const loading = ref(false);

    /* Lifecycle hooks */
    onMounted(async() => {
      user.bday = '1997-07-21';
    });

    /* Methods */
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Event handlers */
    const login = () => {
      user.bday = user.bday.slice(0, 10)
      loading.value = true;
      Keyboard.hide();
      // Napraviti update metoduy u service
      AuthService.login(user)
                 .then(async() => {
                   await store.dispatch("auth/getAuthUser");
                   let homeRoute = store.getters["auth/isStaff"] ? { name: 'staff.home' } : { name: 'home' };
                   user.email = '';
                   user.password = '';
                   await router.replace(homeRoute);
                   await showSuccessToast('Successfully logged in!');
                   loading.value = false;
                 })
                 .catch(async(errors) => {
                   errorNames.value = getError(errors);
                   await showErrorToast(errors);
                   loading.value = false;
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
      fnameInput,
      lnameInput,
      usernameInput,
      bdayInput,
      phoneInput,
      emailInput,
      passwordInput,
      loading,

      /* Event handlers  */
      login,
      togglePasswordShow,

      /* Icons */
      personOutline,
      mailOutline,
      lockOpenOutline,
      eyeOutline,
      eyeOffOutline,
    };
  },
});
</script>
<style scoped>

</style>