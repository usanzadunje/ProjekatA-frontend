<template>
  <div class="accordion-list-box">
    <div @click="togglePane" class="flex justify-between items-center py-2.5">
      <div class="flex items-center">
        <ion-icon
            :icon="icon"
            :style="`font-size:${iconSize}`"
            class="primary-icon-color"
        ></ion-icon>
        <p
            :style="`font-size:${titleSize}`"
            class="inline-block ml-1 cafe-show-menu-headers"
        >{{ title }}</p>
      </div>
      <ion-icon
          :icon="isPanelOpen ? chevronDownOutline : chevronForwardOutline"
          :style="`font-size:${iconSize}`"
          class="primary-icon-color"
      ></ion-icon>
    </div>
    <div ref='panel' :id="panelId" class="panel">
      <div v-if="items">
        <div v-for="item in items" :key="item">
          {{ item }}
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs, watch } from 'vue';
import {
  IonIcon,
}                                              from '@ionic/vue';

import {
  chevronDownOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "AppAccordion",
  components: {
    IonIcon,
  },
  props: {
    panelId: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: 'Title',
    },
    titleSize: {
      type: String,
      default: '0.75rem',
    },
    iconSize: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['panelOpened'],
  setup(props, { emit }) {
    /* Component properties */
    const { isOpen } = toRefs(props);
    const isPanelOpen = ref(false);
    const panel = ref();

    /* Methods */
    const togglePane = (e) => {
      /*
       Select HTML element accordingly to what has been clicked, if header has been clicked
       select sibling(panel element) if panel has been clicked select itself.
      */
      let panel = e.currentTarget.nextElementSibling;

      if(isPanelOpen.value) {
        panel.style.maxHeight = null;
      }else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        emit('panelOpened', props.panelId);
      }

      isPanelOpen.value = !isPanelOpen.value;
    };

    watch(isOpen, () => {
      if(!isOpen.value && isPanelOpen.value) {
        panel.value.style.maxHeight = null;
        isPanelOpen.value = false;
      }
    });

    return {
      /* Component properties */
      isPanelOpen,
      panel,
      /* Methods */
      togglePane,

      /* Icons from */
      chevronDownOutline,
      chevronForwardOutline,
    };

  },
});
</script>
<style scoped>

</style>