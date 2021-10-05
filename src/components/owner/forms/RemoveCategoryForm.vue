<template>
  <div class="flex items-center justify-between">
    <ion-item lines="none" class="rounded-2xl w-4/6">
      <ion-label class="category-label">{{ $t('category', 2) }}</ion-label>
      <ion-select
          v-model="categoriesToRemove"
          multiple="true"
          :cancel-text="$t('cancel')"
          :ok-text="$t('choose')"
          :interface-options="customAlertOptions"
      >
        <ion-select-option value="olives">Black Olives</ion-select-option>
        <ion-select-option value="xcheese">Extra Cheese</ion-select-option>
        <ion-select-option value="peppers">Green Peppers</ion-select-option>
        <ion-select-option value="mushrooms">Mushrooms</ion-select-option>
        <ion-select-option value="onions">Onions</ion-select-option>
        <ion-select-option value="pepperoni">Pepperoni</ion-select-option>
        <ion-select-option value="pineapple">Pineapple</ion-select-option>
        <ion-select-option value="sausage">Sausage</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-button
        @click="removeCategories"
        :disabled="loading"
        size="large"
        expand="block"
        class="auth-button-border-radius uppercase h-11 smallButton"
    >
      <span v-show="!loading">{{ $t('remove') }}</span>
      <ion-spinner v-show="loading" name="crescent"></ion-spinner>
    </ion-button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useI18n }              from 'vue-i18n';
import {
  IonItem,
  IonButton,
  IonSpinner,
  IonLabel,
  IonSelect,
  IonSelectOption,
}                               from '@ionic/vue';

import CategoryService from '@/services/CategoryService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import {} from 'ionicons/icons';


export default defineComponent({
  name: "RemoveCategoryForm",
  components: {
    IonItem,
    IonButton,
    IonSpinner,
    IonLabel,
    IonSelect,
    IonSelectOption,
  },
  props: {},
  setup() {
    /* Global properties and methods */

    /* Composables */
    const { t } = useI18n();
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Component properties */
    const categoriesToRemove = ref(null);
    const customAlertOptions = {
      header: t('category', 2),
      subHeader: t('selectCategoryRemove'),
      translucent: true,
      cssClass: 'custom-category-alert',
    };
    const loading = ref(false);

    /* Computed properties */
    /* Lifecycle hooks */

    /* Methods */

    /* Event handlers */
    const removeCategories = async() => {
      loading.value = true;
      try {
        const payload = {
          categories: categoriesToRemove.value,
        };
        await CategoryService.destroy(payload);

        showSuccessToast(t('owner.removeCategory'));
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = false;
      }
    };
    /* Watchers */


    return {
      /* Global properties */

      /* Component properties */
      customAlertOptions,
      categoriesToRemove,
      loading,

      /* Event handlers  */
      removeCategories,

      /* Icons */
    };
  },
});
</script>
<style scoped>
ion-select::part(text) {
  display: none;
}
</style>