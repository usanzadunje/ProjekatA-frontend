<template>
  <div class="mb-2">
    <FilterCategoryHeading class="mt-7 mb-2" :title="$t('menu')" :icon="bookOutline"/>
    <AccordionList
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
import { defineComponent, toRef } from 'vue';
import {}                         from '@ionic/vue';

import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import AccordionList         from '@/components/user/AccordionList';
import ProductCard           from '@/components/ProductCard';
import AppModal                 from '@/components/AppModal';
import ProductInfoModal from '@/components/user/modals/ProductInfoModal';


import {
  bookOutline,
  beerOutline,
}
                    from 'ionicons/icons';
import { useModal } from '@/composables/useModal';

export default defineComponent({
  name: 'Menu',
  components: {
    FilterCategoryHeading,
    AccordionList,
    ProductCard,
    AppModal,
    ProductInfoModal,
  },
  props: {
    placeInfo: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    /* Global properties */

    /* Component properties */
    const place = toRef(props, 'placeInfo');

    /* Composables */
    const { isModalOpen, modalData, openModal } = useModal();

    /* Lifecycle hooks */

    /* Methods */

    /* Event handlers */
    const showProductModal = (product, category) => {
      product.category = category;

      openModal(true, product);
    };
    return {
      /* Component properties */
      place,
      isModalOpen,
      modalData,

      /* Event handlers */
      openModal,
      showProductModal,

      /* Icons */
      bookOutline,
      beerOutline,
    };
  },
});

</script>