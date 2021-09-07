<template>
  <div class="px-6 mt-5">
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11"
        :class="{ 'error-border' : errorNames.hasOwnProperty('name') }"
    >
      <ion-icon :icon="createOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-capitalize
          v-model.lazy="place.name"
          @keyup.enter="cityInput.$el?.setFocus()"
          type="text"
          debounce="600"
          :placeholder="$t('name')"
          :autofocus="true"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5"
        :class="{ 'error-border' : errorNames.hasOwnProperty('city') }"
    >
      <ion-icon :icon="navigateOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-capitalize
          ref="cityInput"
          v-model="place.city"
          @keyup.enter="addressInput.$el?.setFocus()"
          type="text"
          debounce="600"
          :placeholder="$t('city')"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5"
        :class="{ 'error-border' : errorNames.hasOwnProperty('address') }"
    >
      <ion-icon :icon="homeOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="addressInput"
          v-model="place.address"
          @keyup.enter="emailInput.$el?.setFocus()"
          type="text"
          debounce="600"
          :placeholder="$t('address')"
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
          v-model="place.email"
          @keyup.enter="phoneInput.$el?.setFocus()"
          type="email"
          debounce="600"
          :placeholder="$t('place.email')"
          required
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 mt-3.5"
        :class="{ 'error-border' : errorNames.hasOwnProperty('phone') }"
    >
      <ion-icon :icon="callOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          ref="phoneInput"
          v-model="place.phone"
          @keyup.enter="update"
          type="tel"
          debounce="600"
          :placeholder="$t('phone')"
          required
      ></ion-input>
    </ion-item>

    <div class="mt-20">
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
import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
import { useStore }                                            from 'vuex';
import { useI18n }                                             from 'vue-i18n';
import {
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSpinner,
}
                                                               from "@ionic/vue";

import OwnerService from '@/services/OwnerService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { getError, sleep } from "@/utils/helpers";

import {
  createOutline,
  navigateOutline,
  homeOutline,
  mailOutline,
  callOutline,
} from 'ionicons/icons';

import { Keyboard } from '@capacitor/keyboard';

export default defineComponent({
  name: "EditForm",
  components: {
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonSpinner,
  },
  setup() {
    /* Global properties and methods */
    const store = useStore();
    const { t } = useI18n();

    const placeInfo = computed(() => {
      return store.getters['staff/place'];
    });

    /* Component properties */
    const place = reactive({});
    const errorNames = ref({});
    const cityInput = ref(null);
    const addressInput = ref(null);
    const emailInput = ref(null);
    const phoneInput = ref(null);
    const loading = ref(false);

    /* Lifecycle hooks */
    onMounted(async() => {
      console.log(placeInfo);
      place.name = placeInfo.value.name;
      place.city = placeInfo.value.city;
      place.address = placeInfo.value.address;
      place.email = placeInfo.value.email;
      place.phone = placeInfo.value.phone;
    });

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();


    /* Event handlers */

    /* Event handlers */
    const update = async() => {
      loading.value = true;
      Keyboard.hide();
      try {
        await OwnerService.updatePlace(place);
        await store.dispatch("staff/updatePlaceInfo");
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


    return {
      /* Global properties */
      place,

      /* Component properties */
      errorNames,
      cityInput,
      addressInput,
      phoneInput,
      emailInput,
      loading,

      /* Event handlers  */
      update,

      /* Icons */
      createOutline,
      navigateOutline,
      homeOutline,
      mailOutline,
      callOutline,
    };
  },
});
</script>
<style scoped>

</style>