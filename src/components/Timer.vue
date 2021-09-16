<template>
  <div>
    <span>{{ $t('timeLeft', { time: timeLeft }, timeLeft) }}</span>
  </div>
</template>
<script>

import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'Timer',
  components: {},
  props: {
    start: {
      type: Number,
      default: 0,
    },
  },
  emits: ['subscriptionExpired'],
  setup(props, { emit }) {
    let timeLeft = ref(props.start);

    watch(timeLeft, () => {
      if(timeLeft.value > 0) {
        setTimeout(() => {
          timeLeft.value--;
        }, 60000);
      }

      if(timeLeft.value === 0) {
        emit('subscriptionExpired');
      }
    }, {
      immediate: true,
    });

    return {
      timeLeft,
    };
  },
});
</script>
<style scoped>

</style>