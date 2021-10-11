<template>
  <div class="mb-2">
    <FilterCategoryHeading class="mt-7 mb-2" :title="$t('menu')" :icon="bookOutline"/>
    <AccordionList
        v-for="category in place.categories"
        :key="category"
        class="accordion-list-border-top"
        :title="category.name"
        :icon="beerOutline"
    >
      <ProductCard
          v-for="product in category.products"
          :key="product.id"
          :product="product"
          class="py-1"
          @click="showProductModal(product, category.name)"
      />
    </AccordionList>

    <Modal
        :is-open="isModalOpen"
        css-class="custom-edit-staff-modal"
        @didDismiss="openModal(false);"
        :swipe-to-close="false"
        width="90%"
    >
      <ShortMenuProductModal
          :product="modalData"
          @dismiss="openModal(false)"
      />
    </Modal>
  </div>
</template>
<script>
import { defineComponent, toRef } from 'vue';
import {}                         from '@ionic/vue';

import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import AccordionList         from '@/components/user/AccordionList';
import ProductCard           from '@/components/ProductCard';
import Modal                 from '@/components/Modal';
import ShortMenuProductModal from '@/components/user/modals/ShortMenuProductModal';


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
    Modal,
    ShortMenuProductModal,
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