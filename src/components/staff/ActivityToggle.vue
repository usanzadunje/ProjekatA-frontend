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
        class="pl-0"
        :checked="isStaffActive"
        @click="toggleActivity($event)"
        mode="md"
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

import {
  checkmarkOutline,
  closeOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'ActivityToggle',
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

    /* Event handlers */
    const toggleActivity = async(e) => {
      if(e.target.checked) {
        await store.dispatch('staff/toggleActivity', false);
      }else {
        await store.dispatch('staff/toggleActivity', true);
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
