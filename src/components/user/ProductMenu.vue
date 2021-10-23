<template>
  <div class="mb-2">
    <FilterCategoryHeading class="mt-7 mb-2" :title="$t('menu')" :icon="bookOutline"/>
    <AccordionList
        :panel-id="`productPanel${category.id}`"
        v-for="category in place.categories"
        :key="category"
        :title="category.name"
        :icon="beerOutline"
        class="accordion-list-border-top"
    >
      <ProductCard
          v-for="product in category.products"
          :key="product.id"
          :product="product"
          @click="showProductModal(product, category.name)"
          class="py-1"
      />
      <div class="w-full flex justify-center py-2">
        <ion-button
            v-show="!loadingProducts"
            size="default"
            @click="loadMoreProducts(category.id, $event)"
        >
          {{ $t('loadMore') }}
        </ion-button>
        <ion-spinner
            v-show="loadingProducts"
            name="dots"
            class="my-2 scale2x"
        ></ion-spinner>
      </div>
    </AccordionList>

    <AppModal
        :is-open="isModalOpen"
        css-class="custom-edit-staff-modal"
        :swipe-to-close="false"
        width="90%"
        @didDismiss="openModal(false);"
    >
      <ProductInfoModal
          :product="modalData"
          @dismiss="openModal(false)"
      />
    </AppModal>
  </div>
</template>
<script>
import { defineComponent, reactive } from 'vue';
import { IonButton, IonSpinner }     from '@ionic/vue';

import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import AccordionList         from '@/components/user/AccordionList';
import ProductCard           from '@/components/ProductCard';
import AppModal              from '@/components/AppModal';
import ProductInfoModal      from '@/components/user/modals/ProductInfoModal';

import {
  bookOutline,
  beerOutline,
}
                                      from 'ionicons/icons';
import { useModal }                   from '@/composables/useModal';
import { increaseAccordionMaxHeight } from '@/utils/helpers';

export default defineComponent({
  name: 'Menu',
  components: {
    IonButton,
    IonSpinner,
    FilterCategoryHeading,
    AccordionList,
    ProductCard,
    AppModal,
    ProductInfoModal,
  },
  props: {
    place: {
      type: Object,
      default: null,
    },
    loadingProducts: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    /* Global properties */

    /* Component properties */
    const offset = reactive({});

    /* Composables */
    const { isModalOpen, modalData, openModal } = useModal();

    /* Lifecycle hooks */
    /* Methods */
    const getOffset = (key) => {
      if(key in offset) {
        offset[key] = offset[key] + 10;
      }else {
        offset[key] = 0;
      }

      return offset[key];
    };

    /* Event handlers */
    const showProductModal = (product, category) => {
      product.category = category;

      openModal(true, product);
    };
    const loadMoreProducts = async(categoryId, event) => {
      increaseAccordionMaxHeight(`productPanel${categoryId}`, 1100);
      emit('loadMoreProducts', { categoryId, offset: getOffset(categoryId), event });
    };

    return {
      /* Component properties */
      isModalOpen,
      modalData,

      /* Event handlers */
      openModal,
      showProductModal,
      loadMoreProducts,

      /* Icons */
      bookOutline,
      beerOutline,
    };
  },
});

</script>
<style scoped>
ion-button {
  --background: var(--user-selected-color);
}
</style>