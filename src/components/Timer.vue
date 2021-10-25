<template>
  <div>
    <span v-if="timeLeft === -1" class="lowercase">{{ $t('indefinitely') }}</span>
    <span :id="timerTextId" v-else>{{ $t('timeLeft', { time: timeLeft }, timeLeft) }}</span>
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
    timerTextId: {
      type: String,
      default: null,
    },
  },
  emits: ['subscriptionExpired'],
  setup(props, { emit }) {
    let timeLeft = ref(props.start ?? -1);

    watch(timeLeft, () => {
      if(timeLeft.value > 0) {
        setTimeout(() => {
          timeLeft.value--;
        }, 60000);
      }

      if(timeLeft.value <= 0 && timeLeft.value !== -1) {
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