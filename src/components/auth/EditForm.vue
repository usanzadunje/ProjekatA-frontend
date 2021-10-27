<template>
  <div class="px-8 h-full flex flex-col justify-between">
    <div>
      <div
          class="flex justify-center mb-6"
      >
        <AppAvatar
            :avatar-path="user.avatar ?? authUser.avatar"
            :avatar-img-classes="{ 'error-border' : errorNames.hasOwnProperty('avatar'), 'edit-avatar': true }"
            @click="selectImageSource"
        />
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
            type="text"
            debounce="100"
            :placeholder="$t('fname')"
            :autofocus="true"
            required
            @keyup.enter="lnameInput.$el?.setFocus()"
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('lname') }"
      >
        <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
        <ion-input
            ref="lnameInput"
            v-capitalize
            @keyup.enter="usernameInput.$el?.setFocus()"
            type="text"
            debounce="100"
            :placeholder="$t('lname')"
            required
            v-model="user.lname"
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
            type="text"
            debounce="100"
            :placeholder="$t('username')"
            required
            @keyup.enter="emailInput.$el?.setFocus()"
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
            type="email"
            debounce="100"
            :placeholder="$t('email')"
            required
            @keyup.enter="phoneInput.$el?.setFocus()"
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
            type="tel"
            debounce="100"
            :placeholder="$t('phone')"
            required
            @keyup.enter="update"
        ></ion-input>
      </ion-item>
      <ion-item slot="end" class="ion-no-padding ion-no-margin no-border pl-5 mt-2 bg-transparent">
        <ion-label class="settings-fade-text">{{ $t('passwordChange') }}</ion-label>
        <ion-toggle
            :checked="showPasswordEdit"
            mode="md"
            @ionChange="togglePasswordShow(0, $event)"
        ></ion-toggle>
      </ion-item>
      <div v-show="showPasswordEdit">
        <ion-item
            lines="none"
            class="flex rounded-2xl h-11 mt-3.5 auth-input-background"
            :class="{ 'error-border' : errorNames.hasOwnProperty('login') }"
        >
          <ion-icon :icon="lockOpenOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
          <ion-input
              v-model="user.old_password"
              inputmode="password"
              :type="showOldPassword ? 'text' : 'password'"
              :placeholder="$t('passwordOld')"
              required
              @keyup.enter="passwordInput.$el?.setFocus()"
          ></ion-input>
          <ion-icon
              :icon="showOldPassword ? eyeOutline : eyeOffOutline"
              class="text-xl text-gray-500"
              @click="togglePasswordShow(1)"
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
              inputmode="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="$t('passwordNew')"
              required
              @keyup.enter="passwordConfirmInput.$el?.setFocus()"
          ></ion-input>
          <ion-icon
              :icon="showPassword ? eyeOutline : eyeOffOutline"
              class="text-xl text-gray-500"
              @click="togglePasswordShow(2)"
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
              inputmode="password"
              :type="showPasswordConfirm ? 'text' : 'password'"
              :placeholder="$t('passwordConfirm')"
              required
              @keyup.enter="update"
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
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
          @click="$router.back()"
      >
        {{ $t('cancel') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, toRefs, watch, computed } from 'vue';
import { useStore }                                                           from 'vuex';
import {
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSpinner,
  IonDatetime,
  IonLabel,
  IonToggle,
}                                                                             from "@ionic/vue";

import AppAvatar from '@/components/AppAvatar';

import { usePhotos } from '@/composables/usePhotos';

import { hideNativeKeyboard } from "@/utils/helpers";

import {
  mailOutline,
  lockOpenOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
  callOutline,
}                           from 'ionicons/icons';
import { useErrorHandling } from '@/composables/useErrorHandling';

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
    AppAvatar,
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
    const authUser = computed(() => {
      return store.getters['auth/authUser'];
    });

    /* Component properties */
    const user = reactive({});
    const showOldPassword = ref(false);
    const showPassword = ref(false);
    const showPasswordConfirm = ref(false);
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
    const { clearInputs } = toRefs(props);

    /* Lifecycle hooks */
    onMounted(async() => {
      user.fname = authUser.value.fname;
      user.lname = authUser.value.lname;
      user.username = authUser.value.username;
      user.email = authUser.value.email;
      user.bday = authUser.value.bday;
      user.phone = authUser.value.phone;
    });

    /* Composables */
    const { photo, selectImageSource } = usePhotos();
    const { errorNames, tryCatch } = useErrorHandling();


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
      await hideNativeKeyboard();

      await tryCatch(
          async() => {
            await store.dispatch("auth/updateAuthUser", user);
          },
          'successUpdate',
      );

      loading.value = false;
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

        user.avatar = authUser.value.avatar;
      }
    });
    watch(photo, () => {
      if(photo?.value) {
        user.avatar = photo.value;
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
      loading,
      showPasswordEdit,

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