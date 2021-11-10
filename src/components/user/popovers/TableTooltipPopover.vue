<template>
  <ion-content class="ion-no-padding" :scrollY="false">
    <div class="p-2">
      <div
          class="text-black w-full flex justify-between items-center"
      >
        {{
          $t(
              'currentTableAvailability',
              {
                availability: table?.empty
                    ? $t('empty').toLowerCase()
                    : $t('taken').toLowerCase(),
              },
          )
        }}
        <ion-icon
            :icon="table?.empty ? checkmarkCircleOutline : closeCircleOutline"
            class="flex-shrink-0"
            :class="table?.empty ? 'text-green-500' : 'text-red-500'"
        ></ion-icon>
      </div>
      <hr class="border-b border-gray-300 my-1">
      <div
          class="text-black w-full flex justify-between items-center"
      >
        {{
          table?.smoking_allowed !== undefined
              ?
              $t('currentTableSmokingAllowed', {
                isAllowed: table?.smoking_allowed
                    ? $t('is').toLowerCase()
                    : $t('isNot').toLowerCase(),
              })
              :
              $t('tableSmokingAllowedUnavailable')

        }}
        <ion-icon
            v-if="table?.smoking_allowed !== undefined"
            :icon="table?.smoking_allowed ? checkmarkCircleOutline : logoNoSmoking"
            class="flex-shrink-0"
            :class="table?.smoking_allowed ? 'text-green-500' : 'text-red-500'"
        ></ion-icon>
      </div>
      <hr class="border-b border-gray-300 my-1">
      <div
          class="text-black w-full flex justify-between items-center"
      >
        {{
          table?.seats ?
              $t('numberOfSeatsAtTable', { seats: table?.seats }) :
              $t('numberOfSeatsUnavailable')
        }}
        <ion-icon
            :icon="accessibilityOutline"
            class="flex-shrink-0"
        ></ion-icon>
      </div>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonIcon,
}                          from '@ionic/vue';

import {
  checkmarkCircleOutline,
  closeCircleOutline,
  accessibilityOutline,
  logoNoSmoking,
} from 'ionicons/icons';

export default defineComponent({
  name: 'TableTooltipPopover',
  components: {
    IonContent,
    IonIcon,
  },
  props: {
    table: {
      type: Object,
      default: null,
      required: true,
    },
  },
  setup() {
    /* Global properties */
    /* Event handlers */

    return {
      /* Event handlers */
      /* Icons */
      checkmarkCircleOutline,
      closeCircleOutline,
      accessibilityOutline,
      logoNoSmoking,
    };
  },
});
</script>
<style scoped>
ion-content {
  --background: #E5E7EB;
}

ion-icon {
  font-size: 1.4em;
}
</style>