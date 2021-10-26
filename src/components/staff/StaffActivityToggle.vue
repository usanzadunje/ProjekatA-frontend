<template>
  <div
      class="flex justify-between items-center"
      :class="[isStaffActive ? 'text-green-900' : 'text-red-500']"
  >
    <div class="flex items-center">
      <ion-icon slot="start" :icon="isStaffActive ? checkmarkOutline : closeOutline" :class="iconClasses"></ion-icon>
      <span :class="textClasses">{{ isStaffActive ? $t('active') : $t('inactive') }}</span>
    </div>
    <ion-toggle
        :checked="isStaffActive"
        mode="md"
        class="pl-0"
        @click="toggleActivity($event)"
    ></ion-toggle>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore }                  from 'vuex';
import { useI18n }                   from 'vue-i18n';
import {
  IonIcon,
  IonToggle,
}                                    from '@ionic/vue';

import { useToastNotifications } from '@/composables/useToastNotifications';

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
    const { t } = useI18n();
    const { showErrorToast } = useToastNotifications();

    /* Event handlers */
    const toggleActivity = async(e) => {
      try {
        if(e.target.checked) {
          await store.dispatch('staff/toggleActivity', false);
        }else {
          await store.dispatch('staff/toggleActivity', true);
        }
      }catch(e) {
        showErrorToast(
            null,
            {
              dataFetchingError: t('dataFetchingError'),
            });
      }
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
