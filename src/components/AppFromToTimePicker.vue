<template>
  <div class="flex items-center">
    <ion-button
        :id="startTriggerId"
        class="transparent-button-background text-black"
    >
      {{ start }}
    </ion-button>
    <span class="px-2"> - </span>
    <ion-button
        :id="endTriggerId"
        class="transparent-button-background text-black"
    >
      {{ end }}
    </ion-button>
  </div>
  <ion-popover
      :trigger="startTriggerId"
      :arrow="false"
      side="top"
      css-class="from-to-time-picker-popover"
  >
    <ion-datetime
        v-model="start"
        value="00:00"
        presentation="time"
        hour-cycle="h23"
        class="reset-datetime-bg"
    ></ion-datetime>
  </ion-popover>
  <ion-popover
      :trigger="endTriggerId"
      :arrow="false"
      side="top"
      css-class="from-to-time-picker-popover"
  >
    <ion-datetime
        v-model="end"
        value="00:00"
        presentation="time"
        hour-cycle="h23"
        class="reset-datetime-bg"
    ></ion-datetime>
  </ion-popover>
</template>
<script>
import { defineComponent, ref, toRefs, watch } from 'vue';
import {
  IonButton,
  IonPopover,
  IonDatetime,
}                                              from '@ionic/vue';

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
  emits: ['startChanged', 'endChanged'],
  setup(props, { emit }) {
    /* Global properties */
    /* Component properties */
    const start = ref('00:00');
    const end = ref('00:00');
    const { canInitialize, startValue, endValue } = toRefs(props);

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

    /* Composables */
    /* Event handlers */

    return {
      /* Component properties */
      start,
      end,
      /* Event handlers */
    };
  },
});
</script>
<style scoped>

</style>