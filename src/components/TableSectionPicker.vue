<template>
  <div class="flex justify-center items-center flex-wrap w-full">
    <ion-chip
        :outline="true"
        class="flex-shrink-0"
        :class="activeSection === 1  ? activeCssClasses : inactiveCssClasses"
        @click="$emit('sectionChanged', 1)"
    >
      <ion-label class="uppercase">{{ $t('uncategorized', 2) }}</ion-label>
    </ion-chip>
    <ion-chip
        v-for="section in tableSections"
        :key="section.id"
        :outline="true"
        class="flex-shrink-0"
        :class="activeSection === section.id ? activeCssClasses : inactiveCssClasses"
        @click="$emit('sectionChanged', section.id)"
    >
      <ion-label class="uppercase">{{ section.name }}</ion-label>
    </ion-chip>
  </div>
</template>
<script>
import { defineComponent }   from 'vue';
import { IonChip, IonLabel } from '@ionic/vue';

export default defineComponent({
  name: 'TableSectionPicker',
  components: {
    IonChip,
    IonLabel,
  },
  props: {
    tableSections: {
      type: Object,
      default: null,
    },
    activeSection: {
      type: Number,
      default: 1,
    },
    activeCssClasses: {
      type: String,
      default: '',
    },
    inactiveCssClasses: {
      type: String,
      default: '',
    },
  },
  emits: ['sectionChanged'],
  setup() {
    /* Global properties */
    /* Component properties */
    /* Composables */
    /* Event handlers */

    return {
      /* Component properties */
      /* Event handlers */
    };
  },
});
</script>
<style scoped>

</style>