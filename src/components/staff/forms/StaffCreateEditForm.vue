<template>
  <div class="px-8">
    <h2 v-if="staff" class="secondary-heading text-center mb-6">
      {{ `${$t('editing')}: ${staff.fname} ${staff.lname}` }}
    </h2>
    <h2 v-else class="secondary-heading text-center mb-6"> {{ $t('owner.createStaff') }}</h2>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11"
        :class="{ 'error-border' : errorNames.hasOwnProperty('fname') }"
    >
      <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-model.lazy="user.fname"
          v-capitalize
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
          v-model.lazy="user.lname"
          v-capitalize
          type="text"
          debounce="100"
          :placeholder="$t('lname')"
          required
          @keyup.enter="usernameInput.$el?.setFocus()"
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
          v-model.lazy="user.username"
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
      <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="emailInput"
          v-model.lazy="user.email"
          type="email"
          debounce="100"
          :placeholder="$t('email')"
          required
          @keyup.enter="passwordInput.$el?.setFocus()"
      ></ion-input>
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
          @keyup.enter="createOrUpdate"
      ></ion-input>
      <ion-icon :icon="showPassword ? eyeOutline : eyeOffOutline"
                @click="togglePasswordShow"
                class="text-xl text-gray-500"
      >
      </ion-icon>
    </ion-item>

    <div class="mt-6">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="createOrUpdate"
      >
        {{ loading ? $t('checking') : (!staff ? $t('create') : $t('update')) }}
        <ion-spinner v-if="loading" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
      <ion-button
          :disabled="loading"
          fill="clear"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
          @click="$emit('dismiss')"
      >
        {{ $t('cancel') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, toRefs } from 'vue';
import { useStore }                                          from 'vuex';
import { useI18n }                                           from 'vue-i18n';
import {
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSpinner,
}                                                            from "@ionic/vue";

import { useToastNotifications } from '@/composables/useToastNotifications';

import { getError, hideNativeKeyboard, sleep } from "@/utils/helpers";

import {
  mailOutline,
  lockOpenOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "StaffCreateEditForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonSpinner,
  },
  props: {
    staff: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties and methods */
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    const { staff } = toRefs(props);
    const user = reactive({});
    const showPassword = ref(false);
    const errorNames = ref({});

    const fnameInput = ref(null);
    const lnameInput = ref(null);
    const usernameInput = ref(null);
    const emailInput = ref(null);
    const passwordInput = ref(null);
    const loading = ref(false);

    /* Lifecycle hooks */
    onMounted(async() => {
      if(staff?.value) {
        user.fname = staff.value.fname;
        user.lname = staff.value.lname;
        user.username = staff.value.username;
        user.email = staff.value.email;
      }
    });

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();


    /* Event handlers */
    const createOrUpdate = async() => {
      loading.value = true;
      await hideNativeKeyboard();
      try {
        if(staff?.value) {
          await store.dispatch("owner/updateStaff", { staffId: staff.value.id, user });
          showSuccessToast(t('owner.updatedStaff'));
        }else {
          await store.dispatch("owner/createStaff", user);
          showSuccessToast(t('owner.createdStaff'));
        }

        emit('dismiss');
      }catch(errors) {
        errorNames.value = getError(errors);
        await showErrorToast(errors);
        await sleep(Object.keys(errorNames.value).length * 900);
        errorNames.value = {};
      }finally {
        loading.value = false;
      }
    };
    const togglePasswordShow = () => {
      showPassword.value = !showPassword.value;
    };

    return {
      /* Global properties */
      store,

      /* Component properties */
      user,
      showPassword,
      errorNames,
      fnameInput,
      lnameInput,
      usernameInput,
      emailInput,
      passwordInput,
      loading,

      /* Event handlers  */
      createOrUpdate,
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