<template>
  <div>
    <div>
      <ion-searchbar
          :value="searchTerm"
          :placeholder="$t('searchProductPlaceholder')"
          @ionChange="searchInputChanged($event)"
          enterkeyhint="search"
      ></ion-searchbar>
    </div>
    <div class="flex justify-end mt-2">
      <ion-button
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white"
          @click="showCreateProductModal"
      >
        {{ $t('create') }}
      </ion-button>
    </div>

    <ion-list class="mt-4" lines="none">
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
              <div class="flex justify-end items-center w-20">
                <ion-icon
                    slot="icon-only"
                    :icon="createOutline"
                    class="text-2xl text-blue"
                ></ion-icon>
                <ion-icon
                    slot="icon-only"
                    :icon="trashOutline"
                    class="text-2xl text-danger ml-2"
                    @click="showAlert(product, false, $event)"
                ></ion-icon>
              </div>
            </ProductCard>
          </div>
        </ion-item>
        <ion-item-options side="end" @ionSwipe="showAlert(product, true)">
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

    <Modal
        :is-open="isModalOpen"
        css-class="custom-edit-staff-modal"
        @didDismiss="openModal(false);"
        :swipe-to-close="false"
        width="90%"
    >
      <CreateEditProductModal
          :product="modalData"
          @dismiss="openModal(false)"
      />
    </Modal>
  </div>

  <ion-infinite-scroll
      @ionInfinite="loadMoreProducts($event)"
      threshold="100px"
      :disabled="isInfiniteScrollDisabled"
  >
    <ion-infinite-scroll-content
        class="mt-6"
        loading-spinner="crescent"
        :loading-text="$t('refresherText')">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
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

import ProductCard            from '@/components/ProductCard';
import Modal                  from '@/components/Modal';
import CreateEditProductModal from '@/components/owner/modals/CreateEditProductModal';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useModal }              from '@/composables/useModal';

import { createOutline, trashOutline } from 'ionicons/icons';

import { increaseAccordionMaxHeight } from '@/utils/helpers';

import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useSlidingItem }       from '@/composables/useSlidingItem';

export default defineComponent({
  name: 'Products',
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
    Modal,
    CreateEditProductModal,
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
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { isModalOpen, modalData, openModal } = useModal();
    const { slidingItem, closeOpenItems } = useSlidingItem();

    /* Lifecycle hooks */

    /* Methods */
    const removeProduct = async(id) => {
      try {
        await store.dispatch("owner/deleteProduct", id);

        showSuccessToast(t('owner.removeProduct'));
      }catch(errors) {
        await showErrorToast(errors);
      }
    };
    const getProducts = async(load) => {
      isInfiniteScrollDisabled.value = await store.dispatch("owner/getProducts", {
        filter: searchTerm.value,
        offset,
        limit: 15,
        load,
      });
    };

    /* Event handlers */
    const showCreateProductModal = async() => {
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
            mode: 'ios',
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: () => {
                  removeProduct(product.id);
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
      increaseAccordionMaxHeight('productPanel', 1600);
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
      showCreateProductModal,
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
ion-item {
  --background: transparent;
  --inner-padding-end: 0;
}


ion-item-options {
  --border-style: none;
  background-color: #E01B43 !important;
  border-top-right-radius: 1rem !important;
  border-bottom-right-radius: 1rem !important;
}

ion-item-option {
  --border-style: none;
  --background: #e01b43;
  border-top-right-radius: 1rem !important;
  border-bottom-right-radius: 1rem !important;
}

ion-item-option:active {
  --background: #E01B43;
}

ion-searchbar {
  width: 100% !important;
  padding: 0 !important;
  margin-left: 0 !important;
  --background: #F6F7FB !important;
  --placeholder-color: #9EAAB7 !important;
  --icon-color: #000000 !important;
}
</style>