<template>
  <div class="flex items-center">
    <ion-button
        id="colorPickerResetText"
        fill="clear"
        :style="{ color: resetTextColor }"
        class="settings-item-text uppercase"
        @click="resetDefaults"
    >
      {{ $t('reset') }}
    </ion-button>
    <ion-button class="user-selected-paint w-10 radius-11px reset-button-size">
      <ion-input
          v-model="color"
          type="color"
          class="opacity-0"
          @ionChange="colorChanged"
      >
      </ion-input>
    </ion-button>
  </div>
</template>
<script>

import { defineComponent, ref } from 'vue';
import { useStore }             from 'vuex';
import {
  IonButton,
  IonInput,
}                               from '@ionic/vue';

export default defineComponent({
  name: 'ColorPicker',
  components: {
    IonButton,
    IonInput,
  },
  props: {
    resetTextColor: {
      type: String,
      default: '',
    },
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const color = ref(getComputedStyle(document.documentElement)
        .getPropertyValue('--user-selected-color'));

    /* Composables */

    /* Event handlers */
    const colorChanged = () => {
      store.dispatch('user/setGlobalColor', color.value);
    };

    const resetDefaults = async() => {
      await store.dispatch('user/resetGlobalColor');
    };


    return {
      /* Component properties */
      color,

      /* Event handlers */
      colorChanged,
      resetDefaults,
    };
  },
});
</script>
<style scoped>
</style>