<template>
  <div>
    <div class="flex justify-end">
      <ion-button
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white"
          @click="createProduct"
      >
        {{ $t('create') }}
      </ion-button>
    </div>

    <ion-list class="mt-4" lines="none">
      <ion-item-sliding
          v-for="product in products"
          :key="product.id"
          class="ion-no-padding mb-2"
      >
        <ion-item class="ion-no-padding ion-no-margin" lines="none">
          <div class="flex justify-between items-center w-full">
            <ProductCard
                :product="product"
                class="w-full"
                @click="editProduct(product)"
            >
              <div class="flex justify-end items-center w-20">
                <ion-icon
                    slot="icon-only"
                    :icon="createOutline"
                    class="text-2xl text-blue"
                    @click="editProduct(product)"
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
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import { useI18n }                   from 'vue-i18n';
import {
  IonButton,
  IonList,
  IonItemSliding,
  IonItem,
  IonIcon,
  IonItemOptions,
  IonItemOption, alertController,
}                                    from '@ionic/vue';

import ProductCard            from '@/components/ProductCard';
import Modal                  from '@/components/Modal';
import CreateEditProductModal from '@/components/owner/modals/CreateEditProductModal';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useModal }              from '@/composables/useModal';

import {
  createOutline,
  trashOutline,
} from 'ionicons/icons';

import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
    ProductCard,
    Modal,
    CreateEditProductModal,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const products = computed(() => store.getters['owner/products']);

    /* Lifecycle hooks */
    const { t } = useI18n();
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { isModalOpen, modalData, openModal } = useModal();

    /* Methods */
    const removeProduct = async(id) => {
      try {
        await store.dispatch("owner/deleteProduct", id);

        showSuccessToast(t('owner.removeProduct'));
      }catch(errors) {
        await showErrorToast(errors);
      }
    };

    /* Event handlers */
    const createProduct = async() => {
      modalData.value = null;

      openModal(true);
    };
    const editProduct = async(product, event = null) => {
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

    return {
      /* Component properties */
      products,
      isModalOpen,
      modalData,

      /* Event handlers */
      openModal,
      createProduct,
      editProduct,
      showAlert,

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
</style>