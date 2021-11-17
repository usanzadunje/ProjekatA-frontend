<template>
  <div
      v-if="false"
  >
    STAFF MEMBERS
  </div>
  <div
      v-else
      class="flex flex-col justify-center items-center h-3/5"
  >
    <NoSchedulePlaceholderImage
        :width="'70%'"
    />
    <div class="w-full mt-6 px-2 flex flex-col items-center justify-center">
      <h2 class="placeholder-heading-big primary-text-color break-words text-center">
        {{ $t('noStaffSchedule1') }}
      </h2>
      <h3 class="placeholder-heading-small primary-text-color break-words text-center">
        {{ $t('noStaffSchedule2') }}
      </h3>
      <div>
        <ion-button
            class="user-selected-button-background mt-2"
        >
          {{ $t('add') }}
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { IonButton }       from '@ionic/vue';

import NoSchedulePlaceholderImage from '@/components/images/NoSchedulePlaceholderImage';

import { getWeekDayNumbers, days } from '@/utils/helpers';

export default defineComponent({
  name: 'OwnerSchedulePreview',
  components: {
    IonButton,
    NoSchedulePlaceholderImage,
  },
  props: {
    weekStartDay: {
      type: Number,
      default: null,
      required: true,
    },
    weekStartMonth: {
      type: Number,
      default: null,
      required: true,
    },
    selectedYear: {
      type: Number,
      default: null,
      required: true,
    },
  },
  setup() {
    /* Global properties */

    /* Component properties */

    /* Composables */

    /* Event handlers */

    return {
      /* Component properties */
      days,
      getWeekDayNumbers,

      /* Event handlers */

      /* Icons */
    };
  },
});

</script>
<style scoped>

</style>
