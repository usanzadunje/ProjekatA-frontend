<template>
  <div class="px-5">
    <ion-item lines="none" class="border rounded-2xl h-12 auth-input-background">
      <ion-icon :icon="profileOutline" class="mr-2"></ion-icon>
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
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="profileOutline" class="mr-2"></ion-icon>
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
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="profileOutline" class="mr-2"></ion-icon>
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
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="envelopeOutline" class="mr-2"></ion-icon>
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
    <ion-item lines="none" class="border rounded-2xl h-12 mt-3.5 auth-input-background">
      <ion-icon :icon="lockOpenOutline" color="primary" class="mr-2"></ion-icon>
      <ion-input
          v-model="newUser.password"
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
          v-model="newUser.password_confirmation"
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
    <FlashMessage :error="errors.data" class="mb-10"/>
  </div>
</template>

<script>
import { defineComponent, reactive, ref }                                         from 'vue';
import { useRouter }                                                              from 'vue-router';
import { IonItem, IonInput, IonIcon, IonButton }                                  from "@ionic/vue";
import AuthService                                                                from "@/services/AuthService";
import { getError }                                                               from '@/utils/helpers';
import FlashMessage                                                               from '@/components/FlashMessage';
import SocialIcons
                                                                                  from '@/components/social/SocialIcons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { profileOutline, envelopeOutline, lockOpenOutline } from '@/assets/icons';


export default defineComponent({
  name: "RegisterForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    FlashMessage,
    SocialIcons,
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();

    /* Component properties */
    let newUser = reactive({});
    let errors = reactive({ data: {} });
    let showPassword = ref(false);
    let showPasswordConfirm = ref(false);

    /* Component methods */
    let register = () => {
      Object.assign(newUser, newUser, { bday: null, phone: null });
      AuthService.register(newUser)
                 .then(async() => await router.push({ name: 'onboarding' }))
                 .catch((e) => {
                   errors.data = getError(e);
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
      errors,
      showPassword,
      showPasswordConfirm,

      /* Methods */
      register,
      togglePasswordShow,

      /* Icons from ionicon/icons */
      profileOutline,
      envelopeOutline,
      lockOpenOutline,
      eyeOutline,
      eyeOffOutline,
    };
  },
});
</script>