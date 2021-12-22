<template>
  <div class="mb-2">
    <FilterCategoryHeading class="mt-7 mb-2" :title="$t('menu')" :icon="icons['bookOutline']"/>
    <ion-accordion-group class="-mx-4">
      <ion-accordion
          v-for="category in place.categories"
          :key="category.id"
          :value="category.name"
          class="accordion-list-border-top show-bg"
      >
        <ion-item
            slot="header"
            class="show-bg"
            lines="none"
        >
          <ion-icon
              :icon="icons[category.icon]"
              class="primary-icon-color"
          ></ion-icon>
          <span class="primary-text-color ml-2">{{ category.name }}</span>
        </ion-item>

        <div slot="content" class="px-4">
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
        </div>
      </ion-accordion>
    </ion-accordion-group>

    <AppModal
        :is-open="isModalOpen"
        css-class="custom-product-info-modal"
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
import {
  IonButton,
  IonSpinner,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonIcon,
}                                                   from '@ionic/vue';

import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import ProductCard           from '@/components/ProductCard';
import AppModal              from '@/components/AppModal';
import ProductInfoModal      from '@/components/user/modals/ProductInfoModal';

import { useModal } from '@/composables/useModal';

import {
  barbellOutline,
  balloonOutline,
  bagHandleOutline,
  beerOutline,
  bookOutline,
  cafeOutline,
  cartOutline,
  fastFoodOutline,
  fishOutline,
  heartOutline,
  iceCreamOutline,
  leafOutline,
  nutritionOutline,
  pawOutline,
  pizzaOutline,
  restaurantOutline,
  ribbonOutline,
  rocketOutline,
  roseOutline,
  snowOutline,
  starOutline,
  storefrontOutline,
  sunnyOutline,
  thumbsUpOutline,
  wineOutline,
  walletOutline,
  trashOutline,
  timeOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'ProductMenu',
  components: {
    IonButton,
    IonSpinner,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
    IonIcon,
    FilterCategoryHeading,
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
    const icons = {
      barbellOutline: barbellOutline,
      balloonOutline: balloonOutline,
      bagHandleOutline: bagHandleOutline,
      beerOutline: beerOutline,
      bookOutline: bookOutline,
      cafeOutline: cafeOutline,
      cartOutline: cartOutline,
      fastFoodOutline: fastFoodOutline,
      fishOutline: fishOutline,
      heartOutline: heartOutline,
      iceCreamOutline: iceCreamOutline,
      leafOutline: leafOutline,
      nutritionOutline: nutritionOutline,
      pawOutline: pawOutline,
      pizzaOutline: pizzaOutline,
      restaurantOutline: restaurantOutline,
      ribbonOutline: ribbonOutline,
      rocketOutline: rocketOutline,
      roseOutline: roseOutline,
      snowOutline: snowOutline,
      starOutline: starOutline,
      storefrontOutline: storefrontOutline,
      sunnyOutline: sunnyOutline,
      thumbsUpOutline: thumbsUpOutline,
      wineOutline: wineOutline,
      walletOutline: walletOutline,
      trashOutline: trashOutline,
      timeOutline: timeOutline,
    };

    /* Composables */
    const { isModalOpen, modalData, openModal } = useModal();

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

      /* Icons */
      icons,
    };
  },
});

</script>
<style scoped>
ion-button {
  --background: var(--user-selected-color);
  --border-radius: 1rem;
}

ion-icon {
  font-size: 1.25rem;
}

span {
  font-size: 0.75rem;
}
</style>