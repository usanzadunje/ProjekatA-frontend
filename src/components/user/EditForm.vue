<template>
  <div id="custom" class="px-8 mt-20">
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('fname') }"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-capitalize
          v-model.lazy="user.fname"
          @keyup.enter="lnameInput.$el?.setFocus()"
          type="text"
          debounce="600"
          :placeholder="$t('fname')"
          :autofocus="true"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
        :class="{ 'error-border' : errorNames.hasOwnProperty('lname') }"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-capitalize
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
          @keyup.enter="update"
          type="tel"
          debounce="600"
          :placeholder="$t('phone')"
          required
      ></ion-input>
    </ion-item>
    <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pl-5 mt-2">
      <ion-label class="settings-fade-text">{{ $t('passwordChange') }}</ion-label>
      <ion-toggle
          :checked="showPasswordEdit"
          @ionChange="togglePasswordShow(0)"
          mode="md"
      ></ion-toggle>
    </ion-item>
    <div v-if="showPasswordEdit">
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
          :class="{ 'error-border' : errorNames.hasOwnProperty('password') }"
      >
        <ion-icon :icon="lockOpenOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
        <ion-input
            v-model="user.old_password"
            @keyup.enter="passwordInput.$el?.setFocus()"
            debounce="1"
            inputmode="password"
            :type="showOldPassword ? 'text' : 'password'"
            :placeholder="$t('passwordOld')"
            required
        ></ion-input>
        <ion-icon :icon="showOldPassword ? eyeOutline : eyeOffOutline"
                  @click="togglePasswordShow(1)"
                  class="text-xl text-gray-500"
        >

        </ion-icon>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
          :class="{ 'error-border' : errorNames.hasOwnProperty('password') }"
      >
        <ion-icon :icon="lockOpenOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
        <ion-input
            ref="passwordInput"
            v-model="user.password"
            @keyup.enter="passwordConfirmInput.$el?.setFocus()"
            debounce="1"
            inputmode="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('password')"
            required
        ></ion-input>
        <ion-icon :icon="showPassword ? eyeOutline : eyeOffOutline"
                  @click="togglePasswordShow(2)"
                  class="text-xl text-gray-500"
        >

        </ion-icon>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
          :class="{ 'error-border' : errorNames.hasOwnProperty('password') }"
      >
        <ion-icon :icon="lockOpenOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
        <ion-input
            ref="passwordConfirmInput"
            v-model="user.password_confirmation"
            @keyup.enter="update"
            debounce="1"
            inputmode="password"
            :type="showPasswordConfirm ? 'text' : 'password'"
            :placeholder="$t('passwordConfirm')"
            required
        ></ion-input>
        <ion-icon :icon="showPasswordConfirm ? eyeOutline : eyeOffOutline"
                  @click="togglePasswordShow(3)"
                  class="text-xl text-gray-500"
        ></ion-icon>
      </ion-item>
    </div>

    <div class="mt-6">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="update"
      >
        {{ loading ? $t('checking') : $t('update') }}
        <ion-spinner v-if="loading" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
      <ion-button
          :disabled="loading"
          fill="clear"
          routerLink="/dashboard"
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
import { useRouter }                                 from 'vue-router';
import { useStore }                                  from 'vuex';
import { useI18n }                                   from 'vue-i18n';
import {
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSpinner,
  IonDatetime,
  IonLabel,
  IonToggle,
}
                                                     from "@ionic/vue";

import AuthService from "@/services/AuthService";

import { useToastNotifications } from '@/composables/useToastNotifications';

import { getError, sleep } from "@/utils/helpers";

import { Keyboard } from '@capacitor/keyboard';

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
    IonToggle,
    IonLabel,
  },
  setup() {
    /* Global properties and methods */
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    let user = reactive({});
    let showOldPassword = ref(false);
    let showPassword = ref(false);
    let showPasswordConfirm = ref(false);
    let errorNames = ref({});
    const fnameInput = ref(null);
    const lnameInput = ref(null);
    const usernameInput = ref(null);
    const emailInput = ref(null);
    const bdayInput = ref(null);
    const phoneInput = ref(null);
    const passwordInput = ref(null);
    const passwordConfirmInput = ref(null);
    const loading = ref(false);
    const showPasswordEdit = ref(false);

    /* Lifecycle hooks */
    onMounted(async() => {
      user.fname = store.getters['auth/authUser'].fname;
      user.lname = store.getters['auth/authUser'].lname;
      user.username = store.getters['auth/authUser'].username;
      user.email = store.getters['auth/authUser'].email;
      user.bday = store.getters['auth/authUser'].bday;
      user.phone = store.getters['auth/authUser'].phone;
    });

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Event handlers */
    const update = async() => {
      if(user.bday) {
        user.bday = user.bday.slice(0, 10);
      }
      loading.value = true;
      Keyboard.hide();
      // Napraviti update metoduy u service
      try {
        await AuthService.updateUser(user);
        await store.dispatch("auth/getAuthUser");
        showSuccessToast(t('successUpdate'));
        await router.push({ name: 'dashboard' });
      }catch(errors) {
        errorNames.value = getError(errors);
        await showErrorToast(errors);
        await sleep(Object.keys(errorNames.value).length * 900);
        errorNames.value = {};
      }finally {
        loading.value = false;
      }
    };
    const togglePasswordShow = (input) => {
      switch(input) {
        case 0:
          showPasswordEdit.value = !showPasswordEdit.value;
          break;
        case 1:
          showOldPassword.value = !showOldPassword.value;
          break;
        case 2:
          showPassword.value = !showPassword.value;
          break;
        case 3:
          showPasswordConfirm.value = !showPasswordConfirm.value;
          break;
        default:
          showPasswordEdit.value = !showPasswordEdit.value;
          showOldPassword.value = !showOldPassword.value;
          showPassword.value = !showPassword.value;
          showPasswordConfirm.value = !showPasswordConfirm.value;
      }
    };

    return {
      /* Component properties */
      user,
      showOldPassword,
      showPassword,
      showPasswordConfirm,
      errorNames,
      fnameInput,
      lnameInput,
      usernameInput,
      bdayInput,
      phoneInput,
      emailInput,
      passwordInput,
      passwordConfirmInput,
      loading,
      showPasswordEdit,

      /* Event handlers  */
      update,
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