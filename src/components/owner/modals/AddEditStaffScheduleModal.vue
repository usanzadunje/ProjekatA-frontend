<template>
  <div class="p-4 staff-modal-bg">
    <h2
        class="secondary-heading text-center mb-6"
    >
      {{
        schedule.staff ?
            $t('updateStaffSchedule') :
            $t('addStaffScheduleToSelectedWeek')
      }}
    </h2>
    <AddEditStaffScheduleForm
        :schedule-data="schedule"
        :start-date="schedule.start_date"
        @dismiss="dismiss"
    />
  </div>
</template>

<script>
import { defineComponent }      from 'vue';

import AddEditStaffScheduleForm from '@/components/owner/forms/AddEditStaffScheduleForm';

export default defineComponent({
  name: 'AddEditStaffScheduleModal',
  components: {
    AddEditStaffScheduleForm,
  },
  props: {
    schedule: {
      type: Object,
      default: null,
      required: true,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties */
    /* Component properties */

    /* Lifecycle hooks */


    /* Composables */

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