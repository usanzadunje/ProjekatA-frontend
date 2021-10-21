<template>
  <div id="custom" class="px-8">
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11"
        :class="{ 'error-border' : errorNames.hasOwnProperty('login') }"
    >
      <ion-icon :icon="mailOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="emailInput"
          v-model.lazy="user.login"
          autocomplete="email"
          type="text"
          inputmode="text"
          debounce="300"
          :placeholder="`E-mail ${$t('or')} ${$t('username').toLowerCase()}`"
          :autofocus="true"
          required
          @keyup.enter="passwordInput.$el?.setFocus()"
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5"
        :class="errorNames.hasOwnProperty('login') || errorNames.hasOwnProperty('password') ? 'error-border' : ''"
    >
      <ion-icon :icon="lockOpenOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="passwordInput"
          v-model="user.password"
          inputmode="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
          @keyup.enter="login"
      ></ion-input>
      <ion-icon
          :icon="showPassword ? eyeOutline : eyeOffOutline"
          class="text-xl text-gray-500"
          @click="togglePasswordShow"
      ></ion-icon>
    </ion-item>
    <!--    <div class="relative flex justify-between items-center mt-3.5 px-4 utility-text">-->
    <!--      <div class="flex items-center">-->
    <!--        <ion-checkbox-->
    <!--            v-model="users.remember"-->
    <!--            mode="md"-->
    <!--        ></ion-checkbox>-->
    <!--        <ion-text class="ml-2 fixed-utility-text">Zapamti me</ion-text>-->
    <!--      </div>-->
    <!--      <div class="fixed-utility-text">-->
    <!--        <a href="/forgot-password">Zaboravljena lozinka?</a>-->
    <!--      </div>-->
    <!--    </div>-->
    <SocialIcons class="mt-7"/>
    <div class="mt-6">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="login"
      >
        {{ loading ? $t('checking') : $t('login') }}
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
        {{ $t('register') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { useRouter }                                 from 'vue-router';
import { useStore }                                  from 'vuex';
import { useI18n }                                   from 'vue-i18n';
import {
  IonItem,
  IonInput,
  IonIcon,
  // IonText,
  IonButton,
  // IonCheckbox,
  IonSpinner,
}
                                                     from "@ionic/vue";

import SocialIcons from '@/components/auth/SocialIcons';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { getError, hideNativeKeyboard, sleep } from "@/utils/helpers";

import { Device } from '@capacitor/device';

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
    // IonText,
    IonButton,
    // IonCheckbox,
    IonSpinner,
    SocialIcons,
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    const user = reactive({});
    const showPassword = ref(false);
    const errorNames = ref({});
    const passwordInput = ref(null);
    const emailInput = ref(null);
    const loading = ref(false);

    /* Lifecycle hooks */
    onMounted(async() => {
      const deviceInfo = await Device.getInfo();
      user.device_name = deviceInfo.name || deviceInfo.model;
    });

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Event handlers */
    const login = async() => {
      loading.value = true;
      await hideNativeKeyboard();
      try {
        const role = await store.dispatch("auth/login", user);

        const homeRoute = role ? { name: 'staff.dashboard' } : { name: 'home' };
        await router.replace(homeRoute);

        showSuccessToast(t('successLogin'));
        loading.value = false;
        user.login = '';
        user.password = '';
      }catch(errors) {
        errorNames.value = getError(errors);
        loading.value = false;
        await showErrorToast(errors);
        await sleep(Object.keys(errorNames.value).length * 900);
        errorNames.value = {};
      }
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
      loading,

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

</style>