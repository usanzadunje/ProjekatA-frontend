<template>
  <div class="px-8 h-full flex flex-col justify-between">
    <div>
      <div
          class="flex justify-center mb-6"
      >
        <ion-thumbnail
            class="edit-avatar"
            :class="{ 'error-border' : errorNames.hasOwnProperty('avatar') }"
            @click="selectImageSource"
        >
          <img
              ref="avatarDisplay"
              class="edit-avatar"
              alt="avatar"
              :src="avatar"
          >
        </ion-thumbnail>
      </div>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11"
          :class="{ 'error-border' : errorNames.hasOwnProperty('fname') }"
      >
        <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
        <ion-input
            v-capitalize
            v-model.lazy="user.fname"
            @keyup.enter="lnameInput.$el?.setFocus()"
            type="text"
            debounce="100"
            :placeholder="$t('fname')"
            :autofocus="true"
            required
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('lname') }"
      >
        <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
        <ion-input
            v-capitalize
            ref="lnameInput"
            v-model="user.lname"
            @keyup.enter="usernameInput.$el?.setFocus()"
            type="text"
            debounce="100"
            :placeholder="$t('lname')"
            required
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('username') }"
      >
        <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
        <ion-input
            ref="usernameInput"
            v-model="user.username"
            @keyup.enter="emailInput.$el?.setFocus()"
            type="text"
            debounce="100"
            :placeholder="$t('username')"
            required
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('email') }"
      >
        <ion-icon :icon="mailOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
        <ion-input
            ref="emailInput"
            v-model="user.email"
            @keyup.enter="phoneInput.$el?.setFocus()"
            type="email"
            debounce="100"
            :placeholder="$t('email')"
            required
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('bday') }"
      >
        <ion-label class="settings-fade-text">{{ $t('birthday') }}</ion-label>
        <ion-datetime
            v-model="user.bday"
            :doneText="$t('choose')"
            :cancelText="$t('cancel')"
            display-format="DD MMM YYYY"
            value="1997-07-21"
            :placeholder="$t('selectDate')"
        ></ion-datetime>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('phone') }"
      >
        <ion-icon :icon="callOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
        <ion-input
            ref="phoneInput"
            v-model="user.phone"
            @keyup.enter="update"
            type="tel"
            debounce="100"
            :placeholder="$t('phone')"
            required
        ></ion-input>
      </ion-item>
      <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pl-5 mt-2 bg-transparent">
        <ion-label class="settings-fade-text">{{ $t('passwordChange') }}</ion-label>
        <ion-toggle
            :checked="showPasswordEdit"
            @ionChange="togglePasswordShow(0, $event)"
            mode="md"
        ></ion-toggle>
      </ion-item>
      <div v-show="showPasswordEdit">
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
            :class="{ 'error-border' : errorNames.hasOwnProperty('password') }"
        >
          <ion-icon :icon="lockOpenOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
          <ion-input
              v-model="user.old_password"
              @keyup.enter="passwordInput.$el?.setFocus()"
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
              inputmode="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('passwordNew')"
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
          @click="$router.back()"
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
import { defineComponent, ref, reactive, onMounted, toRefs, watch, computed } from 'vue';
import { useStore }                                                           from 'vuex';
import { useI18n }                                                            from 'vue-i18n';
import {
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSpinner,
  IonDatetime,
  IonLabel,
  IonToggle,
  IonThumbnail,
}                                                                             from "@ionic/vue";

import { useToastNotifications } from '@/composables/useToastNotifications';
import { usePhotos }             from '@/composables/usePhotos';

import { Keyboard } from '@capacitor/keyboard';

import { getError, sleep } from "@/utils/helpers";

import {
  mailOutline,
  lockOpenOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
  callOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "EditForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonSpinner,
    IonDatetime,
    IonToggle,
    IonLabel,
    IonThumbnail,
  },
  props: {
    clearInputs: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    /* Global properties and methods */
    const store = useStore();
    const { t } = useI18n();
    //Authenticated users
    const authUser = computed(() => {
      return store.getters['auth/authUser'];
    });

    /* Component properties */
    const user = reactive({});
    const showOldPassword = ref(false);
    const showPassword = ref(false);
    const showPasswordConfirm = ref(false);
    const errorNames = ref({});
    const fnameInput = ref(null);
    const lnameInput = ref(null);
    const usernameInput = ref(null);
    const emailInput = ref(null);
    const bdayInput = ref(null);
    const phoneInput = ref(null);
    const passwordInput = ref(null);
    const passwordConfirmInput = ref(null);
    const avatarDisplay = ref(null);
    const loading = ref(false);
    const showPasswordEdit = ref(false);
    const { clearInputs } = toRefs(props);
    const avatar = ref(null);

    /* Lifecycle hooks */
    onMounted(async() => {
      user.fname = authUser.value.fname;
      user.lname = authUser.value.lname;
      user.username = authUser.value.username;
      user.email = authUser.value.email;
      user.bday = authUser.value.bday;
      user.phone = authUser.value.phone;
      avatar.value = authUser.value.avatar;
    });

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { photo, selectImageSource } = usePhotos();


    /* Methods */
    const clearPasswordInputs = () => {
      delete user.old_password;
      delete user.password;
      delete user.password_confirmation;
    };

    /* Event handlers */
    const update = async() => {
      if(user.bday) {
        user.bday = user.bday.slice(0, 10);
      }
      if((!user.old_password && !user.password) || !showPasswordEdit.value) {
        clearPasswordInputs();
      }
      loading.value = true;
      Keyboard.hide();
      try {
        await store.dispatch("auth/updateAuthUser", user);

        showSuccessToast(t('successUpdate'));
      }catch(errors) {
        errorNames.value = getError(errors);
        await showErrorToast(errors);
        await sleep(Object.keys(errorNames.value).length * 900);
        errorNames.value = {};
      }finally {
        loading.value = false;
      }
    };
    const togglePasswordShow = (input, e = null) => {
      switch(input) {
        case 0:
          showPasswordEdit.value = e.target.checked;
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

    /* Watchers */
    watch(clearInputs, () => {
      if(clearInputs.value) {
        showPasswordEdit.value = false;
        showOldPassword.value = false;
        showPassword.value = false;
        showPasswordConfirm.value = false;
        clearPasswordInputs();

        delete user.avatar;
      }
    });
    watch(photo, () => {
      if(photo?.value) {
        user.avatar = photo.value;

        avatarDisplay.value.src = photo.value;
      }
    });
    return {
      /* Global properties */
      store,
      authUser,

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
      avatarDisplay,
      loading,
      showPasswordEdit,
      avatar,

      /* Event handlers  */
      update,
      togglePasswordShow,
      selectImageSource,

      /* Icons */
      personOutline,
      mailOutline,
      lockOpenOutline,
      eyeOutline,
      eyeOffOutline,
      callOutline,
    };
  },
});
</script>
<style scoped>

</style>