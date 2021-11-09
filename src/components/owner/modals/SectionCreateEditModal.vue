<template>
  <div class="p-4 staff-modal-bg">
    <h2 v-if="section" class="secondary-heading text-center mb-6">
      {{ `${$t('editing')}: ${section.name}` }}
    </h2>
    <h2 v-else class="secondary-heading text-center mb-6"> {{ $t('createSection') }}</h2>

    <SectionCreateEditForm
        :section="section"
        class="px-6"
        @dismiss="dismiss"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import SectionCreateEditForm from '@/components/owner/forms/SectionCreateEditForm';

export default defineComponent({
  name: 'SectionCreateEditModal',
  components: {
    SectionCreateEditForm,
  },
  props: {
    section: {
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