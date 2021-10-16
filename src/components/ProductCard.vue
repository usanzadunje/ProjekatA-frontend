<template>
  <div>
    <div
        class="flex items-center justify-between py-2 px-2 rounded-2xl bg-gray-100"
    >
      <div class="flex items-center">
        <img
            :src="backendStorageURL + mainImagePath"
            :alt="`Image of ${product.name} menu product`"
        >
        <div class="ml-3">
          <h3 class="mb-1">{{ product.name }}</h3>
          <p>
            {{
              product.description?.length > 45
                  ? product.description.substring(0, 45).concat('...')
                  : (product.description ?? '')
            }}
          </p>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script>

import { computed, defineComponent, toRefs } from 'vue';
import {}                                    from '@ionic/vue';

export default defineComponent({
  name: 'ProductCard',
  components: {},
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    /* Global properties */

    /* Component properties */
    const { product } = toRefs(props);
    const mainImagePath = computed(() => {
      if(product.value.images?.length > 0) {
        return product.value.images.find(image => image.is_main === 1)?.path ??
            product.value.images[0]?.path;
      }else {
        return '/places/default_place_product_logo.png';
      }
    });
    /* Composables */

    /* Event handlers */


    return {
      /* Component properties */
      mainImagePath,

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
  object-fit: cover;
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