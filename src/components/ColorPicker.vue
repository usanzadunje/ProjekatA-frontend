<template>
  <ion-item slot="end" class="ion-no-padding ion-no-margin no-border mr-1">
    <ion-button @click="resetDefaults" class="settings-item-text uppercase" fill="clear" slot="end">
      {{ $t('reset') }}
    </ion-button>
    <ion-button @click="selectColor" class="user-selected-paint w-10 radius-11px" slot="end">
      <input
          ref="colorPicker"
          v-model="color"
          type="color"
          class="hidden"
          @change="colorChanged"
      >
    </ion-button>
  </ion-item>
</template>
<script>

import { defineComponent, ref } from 'vue';
import { useStore }             from 'vuex';
import {
  IonItem,
  IonButton,
}                               from '@ionic/vue';

export default defineComponent({
  name: 'ColorPicker',
  components: {
    IonItem,
    IonButton,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const colorPicker = ref();
    const color = ref(getComputedStyle(document.documentElement)
        .getPropertyValue('--user-selected-color'));

    /* Composables */

    /* Event handlers */
    const selectColor = () => {
      colorPicker.value.click();
    };

    const colorChanged = () => {
      store.dispatch('user/setGlobalColor', color.value);
    };

    const resetDefaults = async() => {
      await store.dispatch('user/resetGlobalColor');
    };


    return {
      /* Component properties */
      colorPicker,
      color,

      /* Event handlers */
      selectColor,
      colorChanged,
      resetDefaults,
    };
  },
});
</script>
<style scoped>
ion-item {
  --background: var(--primary-paint);
  --border-color: rgba(112, 112, 112, 0.1);
  --inner-padding-end: 0;
}
</style>