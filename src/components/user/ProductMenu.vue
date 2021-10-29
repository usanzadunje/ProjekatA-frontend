<template>
  <div class="mb-2">
    <FilterCategoryHeading class="mt-7 mb-2" :title="$t('menu')" :icon="bookOutline"/>
    <AppAccordion
        :panel-id="`productPanel${category.id}`"
        v-for="category in place.categories"
        :key="category.id"
        :title="category.name"
        :icon="beerOutline"
        class="accordion-list-border-top"
        @panel-opened="changeCurrentlyOpenPanel"
        :is-open="checkIfPanelIsOpen(`productPanel${category.id}`)"
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
            v-if="category.products.length >= 7"
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
    </AppAccordion>

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
import { defineComponent, reactive, toRefs, watch } from 'vue';
import { IonButton, IonSpinner }                    from '@ionic/vue';

import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import AppAccordion          from '@/components/AppAccordion';
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
import { useAccordion }               from '@/composables/useAccordion';

export default defineComponent({
  name: 'Menu',
  components: {
    IonButton,
    IonSpinner,
    FilterCategoryHeading,
    AppAccordion,
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
    resetProductOffset: {
      type: Boolean,
      default: null,
    },
  },
  setup(props, { emit }) {
    /* Global properties */

    /* Component properties */
    let offset = reactive({});
    const { resetProductOffset } = toRefs(props);

    /* Composables */
    const { isModalOpen, modalData, openModal } = useModal();
    const { changeCurrentlyOpenPanel, checkIfPanelIsOpen } = useAccordion();

    /* Lifecycle hooks */
    /* Methods */
    const getOffset = (key) => {
      if(key in offset) {
        offset[key] = offset[key] + 10;
      }else {
        offset[key] = 7;
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

    /* Watchers */
    watch(resetProductOffset, () => {
      if(resetProductOffset.value) {
        offset = {};
      }
    });

    return {
      /* Component properties */
      isModalOpen,
      modalData,

      /* Event handlers */
      openModal,
      showProductModal,
      loadMoreProducts,
      changeCurrentlyOpenPanel,
      checkIfPanelIsOpen,

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
  --border-radius: 1rem;
}
</style>