<template>
  <form @submit.prevent="login" class="px-5">
    <ion-item lines="none" class="border rounded-2xl h-12 auth-input-background">
      <ion-icon :icon="envelopeOutline" class="mr-2"></ion-icon>
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
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="lockOpenOutline" class="mr-2"></ion-icon>
      <ion-input
          v-model="user.password"
          inputmode="password"
          :type="showPassword ? 'text' : 'password'"
          debounce="1"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
      ></ion-input>
      <ion-icon :icon="showPassword ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow"></ion-icon>
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
          type="submit"
          size="large"
          expand="block"
          class="auth-button-border-radius uppercase button-text-white"
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
    <FlashMessage :error="errors.data" class="mb-10"/>
  </form>
</template>

<script>
import { defineComponent, ref, reactive }                              from 'vue';
import { useRouter }                                                   from 'vue-router';
import { IonItem, IonInput, IonIcon, IonText, IonButton, IonCheckbox } from "@ionic/vue";
import store                                                           from '@/store/index';
import { mapGetters }                                                  from "vuex";
import AuthService                                                     from "@/services/AuthService";
import { getError }                                                    from '@/utils/helpers';
import FlashMessage                                                    from '@/components/FlashMessage';
import SocialIcons                                                     from '@/components/social/SocialIcons';
import { eyeOutline, eyeOffOutline }     from 'ionicons/icons';
import { envelopeOutline, lockOpenOutline }                                             from '@/assets/icons';

export default defineComponent({
  name: "LoginForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonText,
    IonButton,
    IonCheckbox,
    FlashMessage,
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
    let errors = reactive({ data: {} });
    let showPassword = ref(false);

    /* Component methods */
    const login = () => {
      AuthService.login(user)
                 .then(async() => {
                   await store.dispatch("auth/getAuthUser");
                   let homeRoute = store.getters["auth/isStaff"] ? { name: 'staff.home' } : { name: 'home' };
                   await router.push(homeRoute);
                 })
                 .catch((e) => {
                   errors.data = getError(e);
                 });
    };

    const togglePasswordShow = () => showPassword.value = !showPassword.value;

    return {
      /* Properties */
      user,
      errors,
      showPassword,

      /* Methods */
      login,
      togglePasswordShow,

      /* Icons from ionicon/icons */
      lockOpenOutline,
      eyeOutline,
      eyeOffOutline,
      envelopeOutline
    };
  },
});
</script>