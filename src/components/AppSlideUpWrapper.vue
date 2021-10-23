<template>
  <transition name="slide" appear>
    <slot></slot>
  </transition>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppSlideUpWrapper',
  props: {},
  components: {},
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
.slide-enter-active {
  transition: all 0.2s ease-out;
}

.slide-leave-active {
  transition: all 0.2s ease-in;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
}
</style>