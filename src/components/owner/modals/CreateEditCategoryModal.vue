<template>
  <div class="p-4 staff-modal-bg">
    <h2 v-if="category" class="secondary-heading text-center mb-6">
      {{ `${$t('editing')}: ${category.name}` }}
    </h2>
    <h2 v-else class="secondary-heading text-center mb-6"> {{ $t('createCategory') }}</h2>

    <CreateCategoryForm
        :category="category"
        @dismiss="dismiss"
        class="px-6"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import CreateCategoryForm from '@/components/owner/forms/CreateCategoryForm';


export default defineComponent({
  name: 'CreateEditCategoryModal',
  components: {
    CreateCategoryForm,
  },
  props: {
    category: {
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