<template>
  <div class="relative">
    <div v-show="!showSkeleton">
      <img
          :src="`${backendStorageURL + path}`"
          alt="Main image preview"
          class="banner-image w-full object-cover img-border-15"
      />
    </div>
    <div v-if="showSkeleton !== null" v-show="showSkeleton">
      <ion-skeleton-text animated class="banner-image img-border-15"></ion-skeleton-text>
    </div>
    <div
        v-if="label"
        class="uppercase absolute bottom-2 right-3 bg-black opacity-60 popover-text-block inline-block text-white p-1.5"
    >
      {{ label }}
    </div>
  </div>
</template>
<script>

import { defineComponent } from 'vue';
import {
  IonSkeletonText,
}                          from '@ionic/vue';

export default defineComponent({
  name: 'MainImagePreview',
  components: {
    IonSkeletonText,
  },
  props: {
    label: {
      type: String,
      default: null,
    },
    path: {
      type: String,
      default: null,
    },
    showSkeleton: {
      type: Boolean,
      default: null,
    },
  },
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