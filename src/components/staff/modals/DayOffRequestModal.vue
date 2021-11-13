<template>
  <div class="p-4 staff-modal-bg">
    <h2 class="secondary-heading text-center mb-6">
      {{ `${$t('requestDayOffAt')}:` }}
      <br>
      {{ dayOffStartDate }}
    </h2>
    <DayOffRequestForm
        :day-off-start-date="dayOffStartDate"
        @dismiss="dismiss"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import DayOffRequestForm from '@/components/staff/forms/DayOffRequestForm';

export default defineComponent({
  name: 'DayOffRequestModal',
  components: {
    DayOffRequestForm,
  },
  props: {
    dayOffStartDate: {
      type: String,
      default: '',
      required: true,
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