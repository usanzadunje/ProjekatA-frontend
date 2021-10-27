<template>
  <div>
    <div>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11"
          :class="{ 'error-border' : errorNames.hasOwnProperty('name') }"
      >
        <ion-icon :icon="createOutline" class="mr-2 text-xl text-gray-500"></ion-icon>

        <ion-input
            v-model="newProduct.name"
            v-capitalize
            type="text"
            debounce="100"
            :placeholder="$t('name')"
            required
            @keyup.enter="productCategory.$el?.open()"
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('category_id') }"
      >
        <ion-label class="category-label">{{ $t('productCategory') }}</ion-label>
        <ion-select
            ref="productCategory"
            v-model="newProduct.category_id"
            :cancel-text="$t('cancel')"
            :ok-text="$t('confirm')"
            :interface-options="customAlertOptions"
        >
          <ion-select-option
              v-for="category in categories"
              :key="category"
              :value="category.id"
          >
            {{ category.name }}
          </ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('description') }"
      >

        <ion-textarea
            v-model="newProduct.description"
            v-capitalize
            :placeholder="$t('productDescription')"
            auto-grow="true"
            :autocapitalize="true"
            debounce="100"
            inputmode="text"
            required
        >
        </ion-textarea>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('price') }"
      >
        <ion-icon :icon="walletOutline" class="mr-2 text-xl text-gray-500"></ion-icon>

        <ion-input
            v-model.number="newProduct.price"
            type="number"
            :placeholder="$t('price')"
            required
            @keyup.enter="createOrUpdateProduct"
        ></ion-input>
      </ion-item>
    </div>

    <div class="mt-4">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="createOrUpdateProduct"
      >
        {{ loading ? $t('checking') : (!product ? $t('create') : $t('update')) }}
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
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useStore }                                                    from 'vuex';
import { useI18n }                                                     from 'vue-i18n';
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
}                                                                      from '@ionic/vue';

import { useErrorHandling } from '@/composables/useErrorHandling';
import { hideNativeKeyboard } from '@/composables/useDevice';

import {
  pricetagOutline,
  createOutline,
  walletOutline,

} from 'ionicons/icons';

import { increaseAccordionMaxHeight } from '@/utils/helpers';

export default defineComponent({
  name: "ProductCreateEditForm",
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
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties and methods */
    const store = useStore();

    /* Composables */
    const { t } = useI18n();
    const { errorNames, tryCatch } = useErrorHandling();

    /* Component properties */
    const categories = computed(() => store.getters['owner/categories']);
    const { product } = toRefs(props);
    const newProduct = reactive({});
    const productCategory = ref();
    const loading = ref(false);
    const customAlertOptions = {
      header: t('category', 2),
      subHeader: t('selectCategoryProduct'),
      translucent: true,
      cssClass: 'custom-category-alert',
    };

    /* Methods */
    /* Lifecycle hooks */
    onMounted(async() => {
      if(product?.value) {
        newProduct.name = product.value.name;
        newProduct.category_id = product.value.category_id;
        newProduct.description = product.value.description;
        newProduct.price = product.value.price;
      }
    });

    /* Methods */

    /* Event handlers */
    const createOrUpdateProduct = async() => {
      loading.value = true;
      await hideNativeKeyboard();
      await tryCatch(
          async() => {
            if(product?.value) {
              await store.dispatch("owner/updateProduct", {
                id: product.value.id,
                payload: newProduct,
              });
            }else {
              await store.dispatch("owner/createProduct", newProduct);

              increaseAccordionMaxHeight('productPanel', 100);
            }

            emit('dismiss');
          },
          product?.value ? 'owner.updateProduct' : 'owner.createProduct',
      );

      loading.value = false;
    };

    /* Watchers */


    return {
      /* Global properties */

      /* Component properties */
      categories,
      newProduct,
      productCategory,
      errorNames,
      loading,
      customAlertOptions,

      /* Event handlers  */
      createOrUpdateProduct,

      /* Icons */
      createOutline,
      pricetagOutline,
      walletOutline,
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
  font-size: 0.95rem !important;
  font-weight: 500;
  color: var(--primary-heading) !important;
  opacity: 0.8;
}
</style>