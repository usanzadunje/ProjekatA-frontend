<template>
  <div
      class="flex items-center"
      :class="[isStaffActive ? 'text-green-900' : 'text-red-500']"
  >
    <div class="flex items-center mr-2">
      <ion-icon slot="start" :icon="isStaffActive ? checkmarkOutline : closeOutline" :class="iconClasses"></ion-icon>
      <span :class="textClasses">{{ isStaffActive ? $t('active') : $t('inactive') }}</span>
    </div>
    <ion-toggle
        :checked="isStaffActive"
        mode="md"
        class="pl-0"
        :class="isStaffActive ? 'status-active' : 'status-inactive'"
        @click="toggleActivity($event)"
    ></ion-toggle>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import {
  IonIcon,
  IonToggle,
}                                    from '@ionic/vue';

import { useErrorHandling } from '@/composables/useErrorHandling';

import {
  checkmarkOutline,
  closeOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'StaffActivityToggle',
  components: {
    IonIcon,
    IonToggle,
  },
  props: {
    iconClasses: {
      type: String,
      default: '',
    },
    textClasses: {
      type: String,
      default: '',
    },
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const isStaffActive = computed(() => store.getters['staff/active']);

    /* Composables */
    const { tryCatch } = useErrorHandling();

    /* Event handlers */
    const toggleActivity = async(e) => {
      await tryCatch(
          async() => {
            if(e.target.checked) {
              await store.dispatch('staff/toggleActivity', false);
            }else {
              await store.dispatch('staff/toggleActivity', true);
            }
          },
          null,
          'dataFetchingError',
      );
    };

    return {
      /* Component properties */
      isStaffActive,

      /* Event handlers */
      toggleActivity,

      /* Icons */
      checkmarkOutline,
      closeOutline,
    };
  },
});

</script>
<style scoped>
</style>
