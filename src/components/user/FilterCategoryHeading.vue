<template>
  <div class="flex items-center">
    <ion-icon :icon="icon" class="primary-icon-color category-filter"></ion-icon>
    <span class="sliding-filter-title uppercase ml-0.5">{{ title }}</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonIcon,
} from '@ionic/vue';

import { pieChart } from 'ionicons/icons';

export default defineComponent({
  name: 'FilterCategoryHeading',
  components: {
    IonIcon,
  },
  props: {
    title: {
      type: String,
      default: 'Rezultati pretrage',
    },
    icon: {
      type: String,
      default: pieChart,
    },
  },
  setup() {

    return {
      /* Icons from */
      pieChart,
    };
  },
});
</script>
<style scoped>
  ion-icon {
    font-size: 0.9rem !important;
  }
</style>