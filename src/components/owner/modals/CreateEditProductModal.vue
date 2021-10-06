<template>
  <div class="p-4 staff-modal-bg">
    <h2 v-if="product" class="secondary-heading text-center mb-6">
      {{ `${$t('editing')}: ${product.name}` }}
    </h2>
    <h2 v-else class="secondary-heading text-center mb-6"> {{ $t('createProduct') }}</h2>

    <CreateProductForm
        :product="product"
        @dismiss="dismiss"
        class="px-6"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import CreateProductForm from '@/components/owner/forms/CreateProductForm';


export default defineComponent({
  name: 'CreateEditStaffModal',
  components: {
    CreateProductForm,
  },
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Component properties */

    /* Lifecycle hooks */

    /* Event handlers */

    const dismiss = () => {
      emit('dismiss');
    };

    return {
      /* Component properties */

      /* Event handlers */
      dismiss,

      /* Icons */
    };
  },
});
</script>

<style scoped>

</style>