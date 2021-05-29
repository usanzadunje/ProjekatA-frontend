<template>
  <div class="flex align-middle">
    <ion-icon :icon="icon" class="mr-1 text-gray-400"></ion-icon>
    <span class="sliding-filter-title uppercase">{{ title }}</span>
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