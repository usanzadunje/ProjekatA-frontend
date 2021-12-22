<template>
  <div>
    <div v-if="products.length > 0 || searchTerm !== ''">
      <div>
        <ion-searchbar
            :value="searchTerm"
            :placeholder="$t('searchProductPlaceholder')"
            enterkeyhint="search"
            @ionChange="searchInputChanged($event)"
        ></ion-searchbar>
      </div>
      <div class="flex justify-end mt-2">
        <ion-button
            expand="block"
            class="auth-button-size auth-button-border-radius uppercase button-text-white"
            @click="createProduct"
        >
          {{ $t('create') }}
        </ion-button>
      </div>

      <ion-list
          class="mt-4"
          lines="none"
      >
        <ion-item-sliding
            ref="slidingItem"
            v-for="product in products"
            :key="product.id"
            class="ion-no-padding mb-2"
            @click="closeOpenItems"
        >
          <ion-item
              class="ion-no-padding ion-no-margin"
              lines="none"
              @click="showEditProductModal(product)"
          >
            <div class="flex justify-between items-center w-full">
              <ProductCard
                  :product="product"
                  class="w-full"
              >
                <div class="flex justify-end items-center w-20 ml-1">
                  <ion-icon
                      slot="icon-only"
                      :icon="createOutline"
                      class="text-2xl text-blue flex-shrink-0"
                  ></ion-icon>
                  <ion-icon
                      slot="icon-only"
                      :icon="trashOutline"
                      class="text-2xl text-danger ml-2 flex-shrink-0"
                      @click="showAlert(product, false, $event)"
                  ></ion-icon>
                </div>
              </ProductCard>
            </div>
          </ion-item>
          <ion-item-options side="end" @ionSwipe="showAlert(product, true, $event)">
            <ion-item-option type="button" :expandable="true" @click="showAlert(product, false, $event)">
              <ion-icon
                  slot="icon-only"
                  :icon="trashOutline"
                  class="text-2xl"
              ></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-infinite-scroll
          threshold="100px"
          :disabled="isInfiniteScrollDisabled"
          @ionInfinite="loadMoreProducts($event)"
      >
        <ion-infinite-scroll-content
            loading-spinner="dots"
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </div>
    <div
        v-else
        class="w-full h-full flex flex-col items-start justify-center mt-4 px-6"
    >
      <NoProductsPlaceholderImage/>

      <div class="flex flex-col items-center mt-2">
        <p class="text-center placeholder-heading-big primary-text-color">
          {{ $t('noProductsHeading1') }}
        </p>
        <p class="text-center placeholder-heading-small primary-text-color break-words">
          {{ $t('noProductsHeading2') }}
        </p>

        <ion-button
            class="user-selected-button-background mt-2"
            @click="createProduct"
        >
          {{ $t('add') }}
        </ion-button>
      </div>
    </div>

    <AppModal
        :is-open="isModalOpen"
        css-class="custom-product-modal"
        :swipe-to-close="false"
        width="90%"
        @didDismiss="openModal(false);"
    >
      <ProductCreateEditModal
          :product="modalData"
          @dismiss="openModal(false)"
      />
    </AppModal>
  </div>
</template>

<script>
import { computed, defineComponent, ref, toRefs, watch } from 'vue';
import { useStore }                                      from 'vuex';
import { useI18n }                                       from 'vue-i18n';
import {
  alertController,
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonSearchbar,
}                                                        from '@ionic/vue';

import ProductCard                from '@/components/ProductCard';
import AppModal                   from '@/components/AppModal';
import ProductCreateEditModal     from '@/components/owner/modals/ProductCreateEditModal';
import NoProductsPlaceholderImage from '@/components/images/NoProductsPlaceholderImage';

import { useModal }         from '@/composables/useModal';
import { useSlidingItem }   from '@/composables/useSlidingItem';
import { useErrorHandling } from '@/composables/useErrorHandling';
import { shrink, swipe }    from '@/composables/useAnimations';

import { createOutline, trashOutline } from 'ionicons/icons';

import { Haptics, ImpactStyle } from '@capacitor/haptics';

export default defineComponent({
  name: 'ProductIndex',
  components: {
    IonButton,
    IonList,
    IonItemSliding,
    IonItem,
    IonIcon,
    IonItemOptions,
    IonItemOption,
    IonSearchbar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    ProductCard,
    AppModal,
    ProductCreateEditModal,
    NoProductsPlaceholderImage,
  },
  props: {
    enableInfiniteScroll: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const searchTerm = ref('');
    const products = computed(() => store.getters['owner/products']);
    const isInfiniteScrollDisabled = ref(false);
    let offset = 0;
    const { enableInfiniteScroll } = toRefs(props);

    /* Composables */
    const { t } = useI18n();
    const { isModalOpen, modalData, openModal } = useModal();
    const { slidingItem, closeOpenItems } = useSlidingItem();
    const { tryCatch } = useErrorHandling();
    const { fullSwipeLeft } = swipe();
    const { shrinkToMiddle } = shrink();

    /* Lifecycle hooks */

    /* Methods */
    const removeProduct = async(id) => {
      await tryCatch(
          async() => {
            await store.dispatch("owner/deleteProduct", id);
          },
          {
            successMessageKey: 'owner.removeProduct',
          },
      );
    };
    const getProducts = async(load) => {
      await tryCatch(
          async() => {
            isInfiniteScrollDisabled.value = await store.dispatch("owner/getProducts", {
              filter: searchTerm.value,
              offset,
              limit: 15,
              load,
            });
          },
          {
            errorMessageKey: 'dataFetchingError',
          },
      );
    };

    /* Event handlers */
    const createProduct = async() => {
      modalData.value = null;

      openModal(true);
    };
    const showEditProductModal = async(product, event = null) => {
      event?.stopPropagation();

      openModal(true, product);
    };
    const showAlert = async(product, swiping = null, event = null) => {
      event?.stopPropagation();

      if(swiping) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }

      const alert = await alertController
          .create({
            header: t('alertRemovingProductHeader', { product: product.name }),
            message: t('alertRemovingProductMessage'),
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: () => {
                  removeProduct(product.id);
                  if(swiping) {
                    fullSwipeLeft(event.target.parentElement.firstChild);
                    shrinkToMiddle(event.target.parentElement);
                  }else {
                    fullSwipeLeft(event.target.parentElement.parentElement.parentElement.firstChild);
                    shrinkToMiddle(event.target.parentElement.parentElement.parentElement);
                  }
                },
              },
            ],
          });
      await alert.present();
    };
    const searchInputChanged = (e) => {
      searchTerm.value = e.target.value;
      isInfiniteScrollDisabled.value = false;
      offset = 0;

      getProducts();
    };
    const loadMoreProducts = async(e) => {
      offset += 15;
      await getProducts(true);

      e?.target.complete();
    };

    /* Watchers */
    watch(enableInfiniteScroll, () => {
      if(enableInfiniteScroll.value) {
        offset = 0;
        isInfiniteScrollDisabled.value = false;
      }
    });

    return {
      /* Component properties */
      products,
      isModalOpen,
      modalData,
      searchTerm,
      isInfiniteScrollDisabled,
      slidingItem,

      /* Event handlers */
      openModal,
      createProduct,
      showEditProductModal,
      showAlert,
      searchInputChanged,
      loadMoreProducts,
      closeOpenItems,

      /* Icons */
      createOutline,
      trashOutline,
    };
  },
});
</script>

<style scoped>
ion-list {
  background: transparent;
}

ion-item {
  background: transparent;
  --background: transparent;
  --inner-padding-end: 0;
}

ion-item-options {
  --border-style: none;
  background-color: #E01B43 !important;
  border-radius: 1.2rem !important;
}

ion-item-option {
  --border-style: none;
  --background: #e01b43;
  background: #e01b43;
  border-radius: 1.1rem !important;
}

ion-item-option:active {
  background: #d95c75;
}

ion-searchbar {
  color: #000 !important;
  width: 100% !important;
  padding: 0 !important;
  margin-left: 0 !important;
  --background: #F6F7FB !important;
  --placeholder-color: #9EAAB7 !important;
  --icon-color: #000000 !important;
}

/*ion-infinite-scroll {*/
/*  margin-bottom: -32px !important;*/
/*}*/
</style>