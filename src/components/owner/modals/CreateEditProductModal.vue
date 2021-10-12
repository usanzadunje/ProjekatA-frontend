<template>
  <div class="p-4 staff-modal-bg">
    <h2 v-if="product" class="secondary-heading text-center mb-6">
      {{ `${$t('editing')}: ${product.name}` }}
    </h2>
    <h2 v-else class="secondary-heading text-center mb-6"> {{ $t('createProduct') }}</h2>

    <MainImagePreview
        v-if="product"
        :path="mainImagePath"
        :label="$t('image', 2)"
        @click="openPreview"
    />
    <div
        v-else
        class="text-center placeholder-text-color text-xs"
    >
      {{ $t('createProductImagesAlert') }}
    </div>

    <CreateEditProductForm
        :product="product"
        @dismiss="dismiss"
        class="px-6 mt-3.5"
    />
  </div>
</template>

<script>
import { computed, defineComponent, toRefs } from 'vue';
import { modalController }                   from '@ionic/vue';

import MainImagePreview      from '@/components/MainImagePreview';
import CreateEditProductForm from '@/components/owner/forms/CreateEditProductForm';
import AddProductImagesModal from '@/components/owner/modals/AddProductImagesModal';
import { useStore }          from 'vuex';

export default defineComponent({
  name: 'CreateEditProductModal',
  components: {
    MainImagePreview,
    CreateEditProductForm,
  },
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const { product } = toRefs(props);
    const mainImagePath = computed(() => {
      const currentProduct = store.getters['owner/products'].find(prod => prod.id === product?.value?.id);
      if(currentProduct?.images?.length > 0) {
        return currentProduct?.images?.find(image => image.is_main === 1)?.path ??
            currentProduct?.images[0]?.path;
      }else {
        return '/places/default_place_product_logo.png';
      }
    });

    /* Lifecycle hooks */
    /* Event handlers */
    const dismiss = () => {
      emit('dismiss');
    };
    const openPreview = async() => {
      const modal = await modalController
          .create({
            component: AddProductImagesModal,
            cssClass: 'custom-gallery-modal',
            componentProps: {
              productId: product.value?.id,
            },
          });

      return modal.present();
    };

    return {
      /* Component properties */
      mainImagePath,

      /* Event handlers */
      dismiss,
      openPreview,

      /* Icons */
    };
  },
});
</script>

<style scoped>

</style>