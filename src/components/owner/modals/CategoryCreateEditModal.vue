<template>
  <div class="p-4 staff-modal-bg">
    <h2 v-if="category" class="secondary-heading text-center mb-6">
      {{ `${$t('editing')}: ${category.name}` }}
    </h2>
    <h2 v-else class="secondary-heading text-center mb-6"> {{ $t('createCategory') }}</h2>

    <CategoryCreateEditForm
        :category="category"
        class="px-6"
        @dismiss="dismiss"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import CategoryCreateEditForm from '@/components/owner/forms/CategoryCreateEditForm';


export default defineComponent({
  name: 'CategoryCreateEditModal',
  components: {
    CategoryCreateEditForm,
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