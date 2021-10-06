<template>
  <div class="accordion-list-box">
    <div @click="togglePane" class="flex justify-between items-center py-2.5">
      <div class="flex">
        <ion-icon :icon="icon" class="primary-icon-color"></ion-icon>
        <p class="inline-block ml-1 cafe-show-menu-headers">{{ title }}</p>
      </div>
      <ion-icon :icon="isPanelOpen ? chevronForwardOutline : chevronDownOutline"
                class="primary-icon-color"></ion-icon>
    </div>
    <div class="panel">
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
import { defineComponent, ref } from 'vue';
import {
  IonIcon,
}                               from '@ionic/vue';

import {
  chevronDownOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "AccordionList",
  components: {
    IonIcon,
  },
  props: {
    title: {
      type: String,
      default: 'Title',
    },
    items: {
      type: Array,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
  },
  setup() {
    /* Component properties */
    const isPanelOpen = ref(false);

    /* Methods */
    const togglePane = (e, paneClicked = false) => {
      /*
       Select HTML element accordingly to what has been clicked, if header has been clicked
       select sibling(panel element) if panel has been clicked select itself.
      */
      let panel = paneClicked ? e.currentTarget : e.currentTarget.nextElementSibling;
      if(panel.style.maxHeight) {
        panel.style.maxHeight = null;
      }else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
      isPanelOpen.value = !isPanelOpen.value;
    };

    return {
      /* Component properties */
      isPanelOpen,

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