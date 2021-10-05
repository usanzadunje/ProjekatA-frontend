<template>
  <div class="flex flex-col">
    <div>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11"
          :class="{ 'error-border' : errorNames.hasOwnProperty('name') }"
      >
        <ion-icon :icon="createOutline" class="mr-2 text-xl text-gray-500"></ion-icon>

        <ion-input
            v-capitalize
            v-model.lazy="product.name"
            @keyup.enter="productCategory.$el?.open()"
            type="text"
            debounce="600"
            :placeholder="$t('name')"
            required
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('categories') }"
      >
        <ion-label class="category-label">{{ $t('productCategory') }}</ion-label>
        <ion-select
            ref="productCategory"
            v-model="product.categories"
            multiple="true"
            :cancel-text="$t('cancel')"
            :ok-text="$t('confirm')"
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
      <ion-item
          lines="none"
          class="flex rounded-2xl mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('description') }"
      >

        <ion-textarea
            v-model.lazy="product.description"
            v-capitalize
            :placeholder="$t('productDescription')"
            auto-grow="true"
            :autocapitalize="true"
            debounce="600"
            inputmode="text"
            required
        >
        </ion-textarea>
      </ion-item>
      <!--      ADD IMAGE FUNCTIONALITY HERE-->
      <!--      <ion-item-->
      <!--          lines="none"-->
      <!--          class="flex rounded-2xl h-11 mt-3.5"-->
      <!--          :class="{ 'error-border' : false }"-->
      <!--      >-->
      <!--        &lt;!&ndash;        errorNames.hasOwnProperty('name')&ndash;&gt;-->
      <!--        <ion-icon :icon="pricetagOutline" class="mr-2 text-xl text-gray-500"></ion-icon>-->
      <!--        &lt;!&ndash;      v-model.lazy=""&ndash;&gt;-->
      <!--        &lt;!&ndash;      @keyup.enter=""&ndash;&gt;-->
      <!--        <ion-input-->
      <!--            v-capitalize-->
      <!--            type="text"-->
      <!--            debounce="600"-->
      <!--            :placeholder="$t('category')"-->
      <!--            :autofocus="true"-->
      <!--            required-->
      <!--        ></ion-input>-->
      <!--      </ion-item>-->
    </div>

    <div class="mt-12">
      <ion-button
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="createProduct"
          :disabled="loading"
      >
        {{ loading ? `${$t('checking')}...` : $t('create') }}
        <ion-spinner v-if="loading" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { useI18n }                        from 'vue-i18n';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonTextarea,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
}                                         from '@ionic/vue';

import ProductService from '@/services/ProductService';

import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  pricetagOutline,
  createOutline,

} from 'ionicons/icons';

import { getError, sleep } from '@/utils/helpers';

export default defineComponent({
  name: "CreateMenuItemForm",
  components: {
    IonItem,
    IonIcon,
    IonInput,
    IonTextarea,
    IonLabel,
    IonSelect,
    IonSelectOption,
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
    const product = reactive({});
    const productCategory = ref();
    const errorNames = ref({});
    const loading = ref(false);
    const customAlertOptions = {
      header: t('category', 2),
      subHeader: t('selectCategoryProduct'),
      translucent: true,
      cssClass: 'custom-category-alert',
    };

    /* Computed properties */
    /* Lifecycle hooks */
    /* Methods */

    /* Event handlers */
    const createProduct = async() => {
      loading.value = true;
      try {
        await ProductService.create(product);

        showSuccessToast(t('owner.createProduct'));
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
      product,
      productCategory,
      errorNames,
      loading,
      customAlertOptions,

      /* Event handlers  */
      createProduct,

      /* Icons */
      createOutline,
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

ion-select::part(text) {
  display: none;
}
</style>