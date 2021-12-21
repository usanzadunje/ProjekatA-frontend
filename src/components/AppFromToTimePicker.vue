<template>
  <div class="flex items-center">
    <ion-button
        class="transparent-button-background text-black reset-button-size primary-text-color"
        @click="openPopover(true)"
    >
      {{ start }}
    </ion-button>
    <span class="px-1 primary-text-color"> - </span>
    <ion-button
        class="transparent-button-background text-black reset-button-size primary-text-color"
        @click="openPopover(true, false)"
    >
      {{ end }}
    </ion-button>
  </div>
  <ion-popover
      :is-open="isOpen.start"
      :arrow="false"
      side="top"
      css-class="from-to-time-picker-popover"
      @didDismiss="openPopover(false)"
  >
    <ion-datetime
        v-model="start"
        value="00:00"
        presentation="time"
        hour-cycle="h23"
    ></ion-datetime>
  </ion-popover>
  <ion-popover
      :is-open="isOpen.end"
      :arrow="false"
      side="top"
      css-class="from-to-time-picker-popover"
      @didDismiss="openPopover(false, false)"
  >
    <ion-datetime
        v-model="end"
        value="00:00"
        presentation="time"
        hour-cycle="h23"
    ></ion-datetime>
  </ion-popover>
</template>
<script>
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
import {
  IonButton,
  IonPopover,
  IonDatetime,
}                                                        from '@ionic/vue';

export default defineComponent({
  name: 'AppFromToTimePicker',
  props: {
    startTriggerId: {
      type: String,
      required: true,
    },
    endTriggerId: {
      type: String,
      required: true,
    },
    startValue: {
      type: String,
      default: '00:00',
    },
    endValue: {
      type: String,
      default: '00:00',
    },
    canInitialize: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    IonButton,
    IonPopover,
    IonDatetime,
  },
  emits: ['startChanged', 'endChanged', 'scrollToBottom'],
  setup(props, { emit }) {
    /* Global properties */
    /* Component properties */
    const start = ref('00:00');
    const end = ref('00:00');
    const { canInitialize, startValue, endValue } = toRefs(props);
    const isOpen = reactive({
      start: false,
      end: false,
    });

    /* Event handlers */
    const openPopover = (state, start = true) => {
      if(state) {
        emit('scrollToBottom');
      }

      start ? isOpen.start = state : isOpen.end = state;
    };

    /* Watchers */
    watch(canInitialize, () => {
      if(canInitialize.value) {
        start.value = startValue.value;
        end.value = endValue.value;
      }
    });

    watch(start, () => {
      if(start.value !== startValue.value) {
        emit('startChanged', start.value);
      }
    });

    watch(end, () => {
      if(end.value !== endValue.value) {
        emit('endChanged', end.value);
      }
    });

    return {
      /* Component properties */
      start,
      end,
      isOpen,

      /* Event handlers */
      openPopover,
    };
  },
});
</script>
<style scoped>
</style>