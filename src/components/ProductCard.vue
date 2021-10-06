<template>
  <div>
    <div
        class="flex items-center justify-between py-2 px-2 border border-gray-300 rounded-2xl bg-gray-100"
    >
      <div class="flex items-center">
        <img
            :src="backendStorageURL + product.image_path"
            :alt="`Image of ${product.name} menu product`"
        >
        <div class="ml-3">
          <h3 class="mb-1">{{ product.name }}</h3>
          <p>
            {{
              product.description.length > 45 ? product.description.substring(0, 45).concat('...') : product.description
            }}
          </p>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script>

import { defineComponent } from 'vue';
import {}                  from '@ionic/vue';

export default defineComponent({
  name: 'ProductCard',
  components: {},
  props: {
    product: {
      type: Object,
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

      /* Event handlers */
    };
  },
});
</script>
<style scoped>
img {
  height: 63px;
  width: 63px;
  border-radius: 15px;
}

h3 {
  font-size: 0.925rem;
  font-weight: 600 !important;
  text-transform: capitalize;
  color: #232B38;
}

p {
  font-size: 0.875rem;
  font-weight: 400 !important;
  color: #232B38;
}
</style>