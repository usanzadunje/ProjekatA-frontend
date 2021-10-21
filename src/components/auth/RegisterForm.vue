<template>
  <div class="px-8">
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5"
        :class="{ 'error-border' : errorNames.hasOwnProperty('email') }"
    >
      <ion-icon :icon="mailOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-model.lazy="newUser.email"
          autocomplete="email"
          type="email"
          inputmode="email"
          debounce="300"
          :placeholder="$t('emailAddress')"
          :autofocus="true"
          required
          @keyup.enter="passwordInput.$el?.setFocus()"
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5"
        :class="{ 'error-border' : errorNames.hasOwnProperty('password') }"
    >
      <ion-icon :icon="lockOpenOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="passwordInput"
          v-model="newUser.password"
          inputmode="password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="$t('password')"
          required
          @keyup.enter="passwordConfirmInput.$el?.setFocus()"
      ></ion-input>
      <ion-icon :icon="showPassword ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow(false)"
                class="text-xl text-gray-500"
      >

      </ion-icon>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5"
        :class="{ 'error-border' : errorNames.hasOwnProperty('password') }"
    >
      <ion-icon :icon="lockOpenOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="passwordConfirmInput"
          v-model="newUser.password_confirmation"
          inputmode="password"
          :type="showPasswordConfirm ? 'text' : 'password'"
          :placeholder="$t('passwordConfirm')"
          required
          @keyup.enter="register"
      ></ion-input>
      <ion-icon :icon="showPasswordConfirm ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow(true)"
                class="text-xl text-gray-500"
      ></ion-icon>
    </ion-item>
    <SocialIcons class="mt-7"/>
    <div class="mt-6">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="register"
      >
        {{ loading ? $t('checking') : $t('register') }}
        <ion-spinner v-if="loading" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
      <ion-button
          :disabled="loading"
          fill="clear"
          routerLink="/login"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
      >
        {{ $t('login') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref }         from 'vue';
import { useRouter }                                         from 'vue-router';
import { useStore }                                          from 'vuex';
import { IonItem, IonInput, IonIcon, IonButton, IonSpinner } from "@ionic/vue";

import SocialIcons from '@/components/auth/SocialIcons';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { getError, hideNativeKeyboard, sleep } from "@/utils/helpers";

import { Device } from '@capacitor/device';

import {
  personOutline,
  mailOutline,
  lockOpenOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "RegisterForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonSpinner,
    SocialIcons,
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();
    const store = useStore();

    /* Component properties */
    const newUser = reactive({});
    const showPassword = ref(false);
    const showPasswordConfirm = ref(false);
    const errorNames = ref({});
    const passwordInput = ref(null);
    const passwordConfirmInput = ref(null);
    const loading = ref(false);

    /* Lifecycle hooks */
    onMounted(async() => {
      const deviceInfo = await Device.getInfo();
      newUser.device_name = (deviceInfo.name || deviceInfo.model) || 'random';
    });

    /* Composables */
    const { showErrorToast } = useToastNotifications();

    /* Event handlers */
    const register = async() => {
      loading.value = true;
      await hideNativeKeyboard();
      try {
        await store.dispatch("auth/register", newUser);

        await router.replace({ name: 'onboarding' });

        loading.value = false;
        Object.assign(newUser, {});
      }catch(errors) {
        errorNames.value = getError(errors);
        loading.value = false;
        await showErrorToast(errors);
        await sleep(Object.keys(errorNames.value).length * 900);
        errorNames.value = {};
      }
    };
    let togglePasswordShow = (passwordConfirm = false) => {
      if(passwordConfirm) {
        showPasswordConfirm.value = !showPasswordConfirm.value;
      }else {
        showPassword.value = !showPassword.value;
      }
    };

    return {
      /* Component properties */
      newUser,
      showPassword,
      showPasswordConfirm,
      errorNames,
      passwordInput,
      passwordConfirmInput,
      loading,

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