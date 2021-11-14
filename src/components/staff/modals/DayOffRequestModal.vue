<template>
  <div class="p-4 staff-modal-bg">
    <h2
        class="secondary-heading text-center mb-6"
        :style="requestData.declined && !showRequestForm ? 'color: var(--danger-color);' : ''"
    >
      {{ `${$t('requestDayOffAt')}:` }}
      <br>
      {{ requestData.dayOffStartDate }}
    </h2>

    <div
        v-if="!requestData.declined || showRequestForm"
    >
      <DayOffRequestForm
          :day-off-start-date="requestData.dayOffStartDate"
          @dismiss="dismiss"
      />
    </div>
    <div
        v-else
        class="text-center"
    >
      <h3 class="text-base text-danger text-center">
        {{ $t('requestAlreadyDeclined') }}
      </h3>
      <ion-button
          size="small"
          class="text-white user-selected-button-background mt-2 uppercase"
          @click="showRequestForm = true"
      >
        {{ `${$t('requestDayOff')} ${$t('again').toLowerCase()}` }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonButton }            from '@ionic/vue';

import DayOffRequestForm from '@/components/staff/forms/DayOffRequestForm';

export default defineComponent({
  name: 'DayOffRequestModal',
  components: {
    IonButton,
    DayOffRequestForm,
  },
  props: {
    requestData: {
      type: Object,
      default: null,
      required: true,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Component properties */
    const showRequestForm = ref(false);
    /* Lifecycle hooks */

    /* Event handlers */

    const dismiss = () => {
      emit('dismiss');
    };

    return {
      /* Component properties */
      showRequestForm,

      /* Event handlers */
      dismiss,

      /* Icons */
    };
  },
});
</script>

<style scoped>

</style>