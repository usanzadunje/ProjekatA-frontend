<template>
  <div class="flex items-center justify-between">
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11 w-4/6"
        :class="{ 'error-border' : errorNames.hasOwnProperty('category') }"
    >
      <ion-icon :icon="pricetagOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-capitalize
          v-model.lazy="category"
          @keyup.enter="createCategory"
          type="text"
          debounce="600"
          :placeholder="$t('category')"
          :autofocus="true"
          required
      ></ion-input>
    </ion-item>

    <ion-button
        @click="createCategory"
        :disabled="loading"
        size="large"
        expand="block"
        class="auth-button-border-radius uppercase h-11 smallButton"
    >
      <span v-show="!loading">{{ $t('confirm') }}</span>
      <ion-spinner v-show="loading" name="crescent"></ion-spinner>
    </ion-button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useI18n }              from 'vue-i18n';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonSpinner,
}                               from '@ionic/vue';

import CategoryService from '@/services/CategoryService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  pricetagOutline,
} from 'ionicons/icons';

import { getError, sleep } from '@/utils/helpers';

export default defineComponent({
  name: "CreateCategoryForm",
  components: {
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonSpinner,
  },
  props: {},
  setup() {
    /* Global properties and methods */

    /* Composables */
    const { t } = useI18n();
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Component properties */
    const category = ref(null);
    const errorNames = ref({});
    const loading = ref(false);

    /* Computed properties */
    /* Lifecycle hooks */
    /* Methods */

    /* Event handlers */
    const createCategory = async() => {
      loading.value = true;
      try {
        const payload = {
          category: category.value,
        };
        await CategoryService.create(payload);

        showSuccessToast(t('owner.createCategory'));

        category.value = null;
      }catch(errors) {
        errorNames.value = getError(errors);
        await showErrorToast(errors);
        await sleep(Object.keys(errorNames.value).length * 900);
        errorNames.value = {};
      }finally {
        loading.value = false;
      }
    };

    /* Watchers */


    return {
      /* Global properties */

      /* Component properties */
      category,
      errorNames,
      loading,

      /* Event handlers  */
      createCategory,

      /* Icons */
      pricetagOutline,
    };
  },
});
</script>
<style scoped>
hr {
  border-top: solid 1px var(--primary-heading) !important;
  width: 100% !important;
}
</style>