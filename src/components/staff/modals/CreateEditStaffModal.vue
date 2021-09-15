<template>
  <div class="p-4 staff-modal-bg">
    <CreateEditStaff
        :staff="staff"
        @dismiss="dismiss"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import CreateEditStaff from '@/components/staff/forms/CreateEditStaff';


export default defineComponent({
  name: 'CreateEditStaffModal',
  components: {
    CreateEditStaff,
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