<template>
  <div class="flex relative">
    <ion-icon :icon="icon" class="text-gray-400 category-filter"></ion-icon>
    <span class="sliding-filter-title uppercase absolute left-4 top-1/2 transform -translate-y-1/2">{{ title }}</span>
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