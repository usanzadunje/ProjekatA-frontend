<template>
  <div class="p-4 staff-modal-bg">
    <StaffCreateEditForm
        :staff="staff"
        @dismiss="dismiss"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import StaffCreateEditForm from '@/components/staff/forms/StaffCreateEditForm';


export default defineComponent({
  name: 'StaffCreateEditModal',
  components: {
    StaffCreateEditForm,
  },
  props: {
    staff: {
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