<template>
  <div class="p-0.5 border-2 border-black rounded-md">
    <div id="dropzone" class="relative">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "TableContainer",
  components: {},
  setup() {
    /* Global properties */

    /* Component properties */

    /* Composables */

    /* Lifecycle hooks */

    /* Event handlers */

    return {
      /* Component properties */

      /* Event handlers */
    };
  },

});
</script>
<style scoped>
#dropzone {
  height: 170px;
}
</style>